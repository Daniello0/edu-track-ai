import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { Language } from '../../common/enums/language.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import {
  LLM_INVALID_RESPONSE_MESSAGE,
  LLM_PROCESSING_FAILED_MESSAGE,
  LONG_VIDEO_THRESHOLD_SECONDS,
  AI_CHUNK_MAP_RESPONSE_SCHEMA_NAME,
} from './llm.constants';
import { LlmService } from './llm.service';
import { validateAiMaterialResponse } from './llm.utils';
import { OpenRouterClient } from './openrouter.client';
import type { OpenRouterChatCompletionCreateParams } from './openrouter.types';

const narrativeSettings: ProcessSettingsDto = {
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  hasQuiz: true,
  quizQuestionsCount: 1,
  quizOptionsCount: 4,
};

const aiMaterialResponse = {
  title: 'Intro to Algorithms',
  category: MaterialCategory.MATHEMATICS,
  processedText: '# Algorithms\n\nClean lecture notes.',
  quiz: [
    {
      question: 'What is Big-O?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 1,
    },
  ],
};

describe('LlmService', () => {
  let llmService: LlmService;

  const openRouterClient = {
    createChatCompletion: vi.fn(),
    getModel: vi.fn().mockReturnValue('openrouter/free'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    openRouterClient.createChatCompletion.mockReset();
    openRouterClient.getModel.mockReturnValue('openrouter/free');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: OpenRouterClient,
          useValue: openRouterClient,
        },
        {
          provide: ConfigService,
          useValue: { get: vi.fn() },
        },
      ],
    }).compile();

    llmService = module.get<LlmService>(LlmService);
  });

  it('processes short videos with a single OpenRouter structured output call', async () => {
    openRouterClient.createChatCompletion.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(aiMaterialResponse) } }],
    });

    const result = await llmService.processTranscript({
      transcriptText: 'raw transcript with typoos',
      durationSeconds: LONG_VIDEO_THRESHOLD_SECONDS,
      settings: narrativeSettings,
    });

    expect(openRouterClient.createChatCompletion).toHaveBeenCalledTimes(1);

    const callArgs = openRouterClient.createChatCompletion.mock
      .calls[0]?.[0] as {
      response_format?: {
        type: string;
        json_schema?: {
          strict?: boolean;
          schema?: {
            properties?: {
              category?: { enum?: string[] };
            };
          };
        };
      };
    };

    expect(callArgs.response_format?.type).toBe('json_schema');
    expect(callArgs.response_format?.json_schema?.strict).toBe(true);
    expect(
      callArgs.response_format?.json_schema?.schema?.properties?.category?.enum,
    ).toEqual(Object.values(MaterialCategory));
    expect(result).toEqual({
      title: 'Intro to Algorithms',
      content: '# Algorithms\n\nClean lecture notes.',
      category: MaterialCategory.MATHEMATICS,
      quiz: [
        {
          question: 'What is Big-O?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswerIndex: 1,
        },
      ],
    });
    expect(
      validateAiMaterialResponse(aiMaterialResponse, narrativeSettings),
    ).toBe(true);
  });

  it('uses chunking and MapReduce for videos longer than 45 minutes', async () => {
    const longTranscript = `${'Segment. '.repeat(2000)}Final segment.`;
    const reduceResponse = {
      ...aiMaterialResponse,
      processedText: 'Merged long lecture notes.',
    };

    openRouterClient.createChatCompletion.mockImplementation(
      (params: Omit<OpenRouterChatCompletionCreateParams, 'model'>) => {
        const responseFormat = params.response_format;
        const schemaName =
          responseFormat?.type === 'json_schema'
            ? responseFormat.json_schema.name
            : undefined;

        if (schemaName === AI_CHUNK_MAP_RESPONSE_SCHEMA_NAME) {
          return Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    processedText: 'Mapped chunk text.',
                  }),
                },
              },
            ],
          });
        }

        return Promise.resolve({
          choices: [{ message: { content: JSON.stringify(reduceResponse) } }],
        });
      },
    );

    const result = await llmService.processTranscript({
      transcriptText: longTranscript,
      durationSeconds: LONG_VIDEO_THRESHOLD_SECONDS + 1,
      settings: narrativeSettings,
    });

    expect(
      openRouterClient.createChatCompletion.mock.calls.length,
    ).toBeGreaterThan(1);
    expect(result.content).toBe('Merged long lecture notes.');
  });

  it('returns null quiz when quiz generation is disabled', async () => {
    const noQuizSettings: ProcessSettingsDto = {
      ...narrativeSettings,
      hasQuiz: false,
    };
    const noQuizResponse = {
      title: 'Lecture',
      category: MaterialCategory.TECHNOLOGY,
      processedText: 'Notes',
      quiz: [],
    };

    openRouterClient.createChatCompletion.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(noQuizResponse) } }],
    });

    const result = await llmService.processTranscript({
      transcriptText: 'raw transcript',
      durationSeconds: 600,
      settings: noQuizSettings,
    });

    expect(result.quiz).toBeNull();
  });

  it('throws when OpenRouter returns invalid JSON', async () => {
    openRouterClient.createChatCompletion.mockResolvedValue({
      choices: [{ message: { content: 'not-json' } }],
    });

    await expect(
      llmService.processTranscript({
        transcriptText: 'raw transcript',
        durationSeconds: 600,
        settings: narrativeSettings,
      }),
    ).rejects.toMatchObject({
      response: { message: LLM_INVALID_RESPONSE_MESSAGE },
    });
  });

  it('throws when OpenRouter response fails schema validation', async () => {
    openRouterClient.createChatCompletion.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Lecture',
              category: 'unknown',
              processedText: 'Notes',
              quiz: [],
            }),
          },
        },
      ],
    });

    await expect(
      llmService.processTranscript({
        transcriptText: 'raw transcript',
        durationSeconds: 600,
        settings: narrativeSettings,
      }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('throws when OpenRouter API call fails', async () => {
    openRouterClient.createChatCompletion.mockRejectedValue(
      new Error('network error'),
    );

    await expect(
      llmService.processTranscript({
        transcriptText: 'raw transcript',
        durationSeconds: 600,
        settings: narrativeSettings,
      }),
    ).rejects.toMatchObject({
      response: { message: LLM_PROCESSING_FAILED_MESSAGE },
    });
    await expect(
      llmService.processTranscript({
        transcriptText: 'raw transcript',
        durationSeconds: 600,
        settings: narrativeSettings,
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});
