import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LibraryDetailResponseDto } from '../../common/dto/library/library-detail-response.dto';
import { LibraryListResponseDto } from '../../common/dto/library/library-list-response.dto';
import { MaterialSummaryResponseDto } from '../../common/dto/library/material-summary-response.dto';
import { SubmitQuizAttemptRequestDto } from '../../common/dto/library/submit-quiz-attempt-request.dto';
import { SubmitQuizAttemptResponseDto } from '../../common/dto/library/submit-quiz-attempt-response.dto';
import { UpdateMaterialStatusDto } from '../../common/dto/library/update-material-status.dto';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { MaterialService } from '../material/material.service';
import { PendingMaterialRecord } from '../pending/pending.types';
import { PendingService } from '../pending/pending.service';
import { QuizAttemptService } from '../quiz-attempt/quiz-attempt.service';
import { QuizService } from '../quiz/quiz.service';
import { gradeQuizAnswers } from '../quiz/quiz.utils';
import {
  mapMaterialToDetail,
  mapMaterialToLibraryItem,
  mapMaterialToSummary,
} from './library.utils';
import { Material } from '../material/material.entity';

/** Result of claiming a pending guest material. */
export interface ClaimPendingResult {
  summary: MaterialSummaryResponseDto;
  created: boolean;
}

@Injectable()
export class LibraryService {
  constructor(
    private readonly materialService: MaterialService,
    private readonly quizService: QuizService,
    private readonly quizAttemptService: QuizAttemptService,
    private readonly pendingService: PendingService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Returns the authenticated user's library list.
   */
  async getLibrary(userId: string): Promise<LibraryListResponseDto> {
    const materials = await this.materialService.findAllByUserId(userId);

    return {
      items: materials.map(mapMaterialToLibraryItem),
    };
  }

  /**
   * Returns material detail and updates last_viewed_at.
   */
  async getMaterialDetail(
    userId: string,
    materialId: string,
  ): Promise<LibraryDetailResponseDto> {
    const material = await this.materialService.findByIdForUser(
      userId,
      materialId,
    );
    const updated = await this.materialService.touchLastViewedAt(
      userId,
      materialId,
    );

    return mapMaterialToDetail({
      ...material,
      lastViewedAt: updated.lastViewedAt,
    });
  }

  /**
   * Updates a material status for the authenticated user.
   */
  async updateMaterialStatus(
    userId: string,
    materialId: string,
    dto: UpdateMaterialStatusDto,
  ): Promise<MaterialSummaryResponseDto> {
    const material = await this.materialService.updateStatus(
      userId,
      materialId,
      dto.status,
    );

    return mapMaterialToSummary(material);
  }

  /**
   * Deletes a material and cascaded quiz data for the authenticated user.
   */
  async deleteMaterial(userId: string, materialId: string): Promise<void> {
    await this.materialService.deleteForUser(userId, materialId);
  }

  /**
   * Persists a guest pending material or returns an existing deduplicated item.
   */
  async claimPending(
    userId: string,
    pendingId: string,
  ): Promise<ClaimPendingResult> {
    const pending = this.pendingService.consume(pendingId);
    const existing = await this.materialService.findByUserAndSettingsHash(
      userId,
      pending.settingsHash,
    );

    if (existing) {
      return {
        summary: mapMaterialToSummary(existing),
        created: false,
      };
    }

    const material = await this.persistPendingMaterial(userId, pending);

    return {
      summary: mapMaterialToSummary(material),
      created: true,
    };
  }

  /**
   * Grades quiz answers, stores the attempt, and updates scores and status.
   */
  async submitQuizAttempt(
    userId: string,
    materialId: string,
    dto: SubmitQuizAttemptRequestDto,
  ): Promise<SubmitQuizAttemptResponseDto> {
    const material: Material = await this.materialService.findByIdForUser(
      userId,
      materialId,
    );

    this.validateMaterialHasQuiz(material);

    const graded = gradeQuizAnswers(material.quiz.questions, dto.answers);
    const attempt = await this.quizAttemptService.create(
      material.quiz.id,
      graded.score,
      graded.answers,
    );
    const bestScore = await this.quizService.updateBestScoreIfHigher(
      material.quiz.id,
      graded.score,
    );
    const updatedMaterial = await this.materialService.updateStatus(
      userId,
      materialId,
      graded.status,
    );

    return {
      attemptId: attempt.id,
      score: graded.score,
      bestScore,
      status: updatedMaterial.status,
      answers: graded.answers,
    };
  }

  private async persistPendingMaterial(
    userId: string,
    pending: PendingMaterialRecord,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const material: Material = await this.materialService.create(
        {
          userId,
          videoId: pending.videoId,
          settingsHash: pending.settingsHash,
          title: pending.title,
          content: pending.content,
          category: pending.category,
          format: pending.format,
          summaryLength: pending.summaryLength,
          language: pending.language,
          status: MaterialStatus.READ,
        },
        manager,
      );

      if (pending.questions.length > 0) {
        await this.quizService.createForMaterial(
          material.id,
          pending.questions,
          manager,
        );
      }

      return material;
    });
  }

  private validateMaterialHasQuiz(material: Material): void {
    if (!material.quiz) {
      throw new BadRequestException('Material has no quiz');
    }
  }
}
