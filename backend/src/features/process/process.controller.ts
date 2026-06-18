import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProcessRequestDto } from '../../common/dto/process/process-request.dto';
import { ProcessResponseDto } from '../../common/dto/process/process-response.dto';
import type { AuthenticatedUser } from '../auth/auth.types';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { PROCESS_API_PREFIX } from './process.constants';
import { ProcessService } from './process.service';

@ApiTags('process')
@Controller(PROCESS_API_PREFIX)
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Process a YouTube video into learning material' })
  @ApiOkResponse({
    type: ProcessResponseDto,
    description: 'Video processed successfully',
  })
  process(
    @Body() dto: ProcessRequestDto,
    @CurrentUser() user?: AuthenticatedUser,
  ): Promise<ProcessResponseDto> {
    return this.processService.process(dto, user?.userId);
  }
}
