import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProcessRequestDto } from '../../common/dto/process/process-request.dto';
import { ProcessResponseDto } from '../../common/dto/process/process-response.dto';
import { extractVideoId } from '../../common/utils/youtube.utils';
import { MaterialService } from '../material/material.service';
import { LlmService } from '../llm/llm.service';
import { PendingService } from '../pending/pending.service';
import { QuizService } from '../quiz/quiz.service';
import { TranscriptService } from '../transcript/transcript.service';
import {
  buildProcessedMaterialContext,
  computeProcessSettingsHash,
  mapExistingMaterialToResponse,
  mapGuestProcessResponse,
  mapPersistedProcessResponse,
  ProcessedMaterialContext,
  toCreateMaterialInput,
  toPendingStoreInput,
} from './process.utils';

/** Orchestrates transcript fetch, AI processing, and persistence for video URLs. */
@Injectable()
export class ProcessService {
  constructor(
    private readonly materialService: MaterialService,
    private readonly transcriptService: TranscriptService,
    private readonly llmService: LlmService,
    private readonly quizService: QuizService,
    private readonly pendingService: PendingService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Processes a YouTube video into learning material, optionally persisting it.
   */
  async process(
    dto: ProcessRequestDto,
    userId?: string,
  ): Promise<ProcessResponseDto> {
    const videoId = this.parseVideoId(dto.videoUrl);
    const settingsHash = computeProcessSettingsHash(videoId, dto.settings);

    if (userId) {
      const existing = await this.materialService.findByUserAndSettingsHash(
        userId,
        settingsHash,
      );
      if (existing) {
        return mapExistingMaterialToResponse(existing);
      }
    }

    const transcript = await this.transcriptService.fetchTranscript(videoId);
    const llmResult = await this.llmService.processTranscript({
      transcriptText: transcript.text,
      durationSeconds: transcript.durationSeconds,
      settings: dto.settings,
    });
    const context = buildProcessedMaterialContext(
      videoId,
      settingsHash,
      dto.settings,
      llmResult,
    );

    if (userId) {
      return this.persistForUser(userId, context);
    }

    return this.storeForGuest(context);
  }

  private parseVideoId(videoUrl: string): string {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new BadRequestException('Invalid YouTube video URL');
    }

    return videoId;
  }

  private async persistForUser(
    userId: string,
    context: ProcessedMaterialContext,
  ): Promise<ProcessResponseDto> {
    const materialId = await this.persistMaterialWithQuiz(userId, context);
    return mapPersistedProcessResponse(materialId, context);
  }

  private storeForGuest(context: ProcessedMaterialContext): ProcessResponseDto {
    const pendingId = this.pendingService.store(toPendingStoreInput(context));
    return mapGuestProcessResponse(pendingId, context);
  }

  private async persistMaterialWithQuiz(
    userId: string,
    context: ProcessedMaterialContext,
  ): Promise<string> {
    const material = await this.dataSource.transaction(async (manager) => {
      const created = await this.materialService.create(
        toCreateMaterialInput(userId, context),
        manager,
      );

      const questions = context.llmResult.quiz;
      if (questions && questions.length > 0) {
        await this.quizService.createForMaterial(
          created.id,
          questions,
          manager,
        );
      }

      return created;
    });

    return material.id;
  }
}
