import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ClaimPendingRequestDto } from '../../common/dto/library/claim-pending-request.dto';
import { LibraryDetailResponseDto } from '../../common/dto/library/library-detail-response.dto';
import { LibraryListResponseDto } from '../../common/dto/library/library-list-response.dto';
import { MaterialSummaryResponseDto } from '../../common/dto/library/material-summary-response.dto';
import { SubmitQuizAttemptRequestDto } from '../../common/dto/library/submit-quiz-attempt-request.dto';
import { SubmitQuizAttemptResponseDto } from '../../common/dto/library/submit-quiz-attempt-response.dto';
import { UpdateMaterialStatusDto } from '../../common/dto/library/update-material-status.dto';
import type { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LIBRARY_API_PREFIX } from './library.constants';
import { LibraryService } from './library.service';

@ApiTags('library')
@UseGuards(JwtAuthGuard)
@Controller(LIBRARY_API_PREFIX)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  @ApiOperation({ summary: 'List materials for the authenticated user' })
  @ApiOkResponse({
    type: LibraryListResponseDto,
    description: 'Library items retrieved',
  })
  getLibrary(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<LibraryListResponseDto> {
    return this.libraryService.getLibrary(user.userId);
  }

  @Post('claim-pending')
  @ApiOperation({ summary: 'Persist a guest pending material after login' })
  @ApiCreatedResponse({
    type: MaterialSummaryResponseDto,
    description: 'Pending material saved',
  })
  @ApiOkResponse({
    type: MaterialSummaryResponseDto,
    description: 'Existing material returned by settings hash dedup',
  })
  @ApiNotFoundResponse({ description: 'Pending material not found' })
  async claimPending(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ClaimPendingRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<MaterialSummaryResponseDto> {
    const result = await this.libraryService.claimPending(
      user.userId,
      dto.pendingId,
    );

    response.status(result.created ? HttpStatus.CREATED : HttpStatus.OK);
    return result.summary;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material detail with quiz and attempts' })
  @ApiOkResponse({
    type: LibraryDetailResponseDto,
    description: 'Material detail retrieved',
  })
  @ApiNotFoundResponse({ description: 'Material not found' })
  getMaterialDetail(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LibraryDetailResponseDto> {
    return this.libraryService.getMaterialDetail(user.userId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update material mastery status' })
  @ApiOkResponse({
    type: MaterialSummaryResponseDto,
    description: 'Material status updated',
  })
  @ApiNotFoundResponse({ description: 'Material not found' })
  updateMaterialStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMaterialStatusDto,
  ): Promise<MaterialSummaryResponseDto> {
    return this.libraryService.updateMaterialStatus(user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete material from library' })
  @ApiNoContentResponse({ description: 'Material deleted' })
  @ApiNotFoundResponse({ description: 'Material not found' })
  deleteMaterial(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.libraryService.deleteMaterial(user.userId, id);
  }

  @Post(':id/quiz/attempts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit and grade a quiz attempt' })
  @ApiCreatedResponse({
    type: SubmitQuizAttemptResponseDto,
    description: 'Quiz attempt graded and saved',
  })
  @ApiNotFoundResponse({ description: 'Material not found' })
  submitQuizAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitQuizAttemptRequestDto,
  ): Promise<SubmitQuizAttemptResponseDto> {
    return this.libraryService.submitQuizAttempt(user.userId, id, dto);
  }
}
