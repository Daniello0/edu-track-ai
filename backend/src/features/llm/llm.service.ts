import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import {
  LLM_EMPTY_RESPONSE_MESSAGE,
  LLM_INVALID_RESPONSE_MESSAGE,
  LLM_PROCESSING_FAILED_MESSAGE,
  LONG_VIDEO_THRESHOLD_SECONDS,
  CONFIG_TEMPERATURE,
} from './llm.constants';
import {
  buildChunkMapResponseFormat,
  buildMaterialResponseFormat,
} from './llm.schema';
import {
  AiChunkMapResponse,
  AiMaterialResponse,
  LlmProcessInput,
  LlmProcessResult,
} from './llm.types';
import {
  buildChunkMapPrompts,
  buildMaterialSystemPrompt,
  buildMaterialUserPrompt,
  chunkTranscript,
  DEFAULT_TRANSCRIPT_CHUNK_SIZE,
  mapAiResponseToResult,
  validateAiChunkMapResponse,
  validateAiMaterialResponse,
} from './llm.utils';
import { OpenRouterClient } from './openrouter.client';
import type { OpenRouterChatMessage } from './openrouter.types';

/** Processes transcripts through OpenRouter structured output with optional MapReduce. */
@Injectable()
export class LlmService {
  constructor(private readonly openRouterClient: OpenRouterClient) {}

  /**
   * Transforms a raw transcript into processed material content and optional quiz.
   */
  async processTranscript(input: LlmProcessInput): Promise<LlmProcessResult> {
    const preparedText = await this.prepareTranscriptText(input);
    const response = await this.generateMaterialResponse(
      preparedText,
      input.settings,
      preparedText !== input.transcriptText,
    );

    return mapAiResponseToResult(response, input.settings.hasQuiz);
  }

  private async prepareTranscriptText(input: LlmProcessInput): Promise<string> {
    if (input.durationSeconds <= LONG_VIDEO_THRESHOLD_SECONDS) {
      return input.transcriptText;
    }

    const chunks = chunkTranscript(
      input.transcriptText,
      DEFAULT_TRANSCRIPT_CHUNK_SIZE,
    );
    const mappedChunks = await this.mapTranscriptChunks(chunks, input.settings);

    return mappedChunks.join('\n\n');
  }

  private async mapTranscriptChunks(
    chunks: string[],
    settings: ProcessSettingsDto,
  ): Promise<string[]> {
    const mappedChunks: string[] = [];

    for (const [index, chunk] of chunks.entries()) {
      const mappedChunk = await this.mapTranscriptChunk(
        chunk,
        index,
        chunks.length,
        settings,
      );
      mappedChunks.push(mappedChunk);
    }

    return mappedChunks;
  }

  private async mapTranscriptChunk(
    chunkText: string,
    chunkIndex: number,
    totalChunks: number,
    settings: ProcessSettingsDto,
  ): Promise<string> {
    const prompts = buildChunkMapPrompts(
      chunkText,
      chunkIndex,
      totalChunks,
      settings,
    );
    const response = await this.callOpenRouter<AiChunkMapResponse>(
      [
        { role: 'system', content: prompts.system },
        { role: 'user', content: prompts.user },
      ],
      buildChunkMapResponseFormat(),
      validateAiChunkMapResponse,
    );

    return response.processedText;
  }

  private async generateMaterialResponse(
    transcriptText: string,
    settings: ProcessSettingsDto,
    isReduceStep: boolean,
  ): Promise<AiMaterialResponse> {
    const messages: OpenRouterChatMessage[] = [
      { role: 'system', content: buildMaterialSystemPrompt(settings) },
      {
        role: 'user',
        content: buildMaterialUserPrompt(
          transcriptText,
          isReduceStep,
          settings,
        ),
      },
    ];

    return this.callOpenRouter<AiMaterialResponse>(
      messages,
      buildMaterialResponseFormat(settings),
      (value) => validateAiMaterialResponse(value, settings),
    );
  }

  private async callOpenRouter<T>(
    messages: OpenRouterChatMessage[],
    responseFormat: ReturnType<typeof buildMaterialResponseFormat>,
    validate: (value: unknown) => value is T,
  ): Promise<T> {
    try {
      const completion = await this.openRouterClient.createChatCompletion({
        messages,
        response_format: responseFormat,
        temperature: CONFIG_TEMPERATURE,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new InternalServerErrorException(LLM_EMPTY_RESPONSE_MESSAGE);
      }

      const parsed: unknown = JSON.parse(content);
      if (!validate(parsed)) {
        throw new InternalServerErrorException(LLM_INVALID_RESPONSE_MESSAGE);
      }

      return parsed;
    } catch (error) {
      throw this.mapLlmError(error);
    }
  }

  private mapLlmError(error: unknown): Error {
    if (
      error instanceof InternalServerErrorException ||
      error instanceof BadGatewayException
    ) {
      return error;
    }

    if (error instanceof SyntaxError) {
      return new InternalServerErrorException(LLM_INVALID_RESPONSE_MESSAGE);
    }

    return new BadGatewayException(LLM_PROCESSING_FAILED_MESSAGE);
  }
}
