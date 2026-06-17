import { describe, expect, it } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { Language } from '../../common/enums/language.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import {
  buildChunkMapResponseSchema,
  buildMaterialResponseSchema,
} from './llm.schema';
import {
  chunkTranscript,
  mapAiResponseToResult,
  validateAiChunkMapResponse,
  validateAiMaterialResponse,
} from './llm.utils';

const narrativeSettings: ProcessSettingsDto = {
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  hasQuiz: true,
  quizQuestionsCount: 2,
  quizOptionsCount: 4,
};

const noQuizSettings: ProcessSettingsDto = {
  ...narrativeSettings,
  hasQuiz: false,
};

describe('chunkTranscript', () => {
  it('returns a single chunk when text fits within the limit', () => {
    const text = 'Short lecture transcript.';

    expect(chunkTranscript(text, 100)).toEqual([text]);
  });

  it('splits long text into multiple chunks at natural boundaries', () => {
    const paragraph = 'Word '.repeat(200).trim();
    const text = `${paragraph}. ${paragraph}.`;

    const chunks = chunkTranscript(text, 500);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.join(' ')).toContain('Word');
  });
});

describe('mapAiResponseToResult', () => {
  it('maps processedText to content and correctIndex to correctAnswerIndex', () => {
    const result = mapAiResponseToResult(
      {
        title: 'TypeScript Basics',
        category: MaterialCategory.PROGRAMMING,
        processedText: '# Intro\n\nProcessed content.',
        quiz: [
          {
            question: 'What is TS?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 2,
          },
        ],
      },
      true,
    );

    expect(result).toEqual({
      title: 'TypeScript Basics',
      content: '# Intro\n\nProcessed content.',
      category: MaterialCategory.PROGRAMMING,
      quiz: [
        {
          question: 'What is TS?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswerIndex: 2,
        },
      ],
    });
  });

  it('returns null quiz when quiz generation is disabled', () => {
    const result = mapAiResponseToResult(
      {
        title: 'Lecture',
        category: MaterialCategory.SCIENCE,
        processedText: 'Content',
        quiz: [],
      },
      false,
    );

    expect(result.quiz).toBeNull();
  });
});

describe('validateAiMaterialResponse', () => {
  it('accepts a response matching the JSON schema shape', () => {
    const response = {
      title: 'Lecture',
      category: MaterialCategory.PROGRAMMING,
      processedText: 'Processed markdown',
      quiz: [
        {
          question: 'Q1?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 1,
        },
        {
          question: 'Q2?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
      ],
    };

    expect(validateAiMaterialResponse(response, narrativeSettings)).toBe(true);
  });

  it('rejects invalid category values', () => {
    const response = {
      title: 'Lecture',
      category: 'invalid-category',
      processedText: 'Processed markdown',
      quiz: [],
    };

    expect(validateAiMaterialResponse(response, noQuizSettings)).toBe(false);
  });

  it('requires an empty quiz array when quiz is disabled', () => {
    const response = {
      title: 'Lecture',
      category: MaterialCategory.OTHER,
      processedText: 'Processed markdown',
      quiz: [
        {
          question: 'Q1?',
          options: ['A', 'B', 'C', 'D'],
          correctIndex: 0,
        },
      ],
    };

    expect(validateAiMaterialResponse(response, noQuizSettings)).toBe(false);
  });
});

describe('validateAiChunkMapResponse', () => {
  it('accepts chunk map responses with processedText', () => {
    expect(validateAiChunkMapResponse({ processedText: 'Chunk content' })).toBe(
      true,
    );
  });

  it('rejects chunk map responses without processedText', () => {
    expect(validateAiChunkMapResponse({ title: 'Missing text' })).toBe(false);
  });
});

describe('JSON Schema definitions', () => {
  it('defines MaterialCategory enum values in the full response schema', () => {
    const schema = buildMaterialResponseSchema(narrativeSettings) as {
      properties: { category: { enum: string[] } };
    };

    expect(schema.properties.category.enum).toEqual(
      Object.values(MaterialCategory),
    );
  });

  it('constrains quiz length and options count in the full response schema', () => {
    const schema = buildMaterialResponseSchema(narrativeSettings) as {
      properties: {
        quiz: {
          minItems: number;
          maxItems: number;
          items: {
            properties: {
              options: { minItems: number; maxItems: number };
            };
          };
        };
      };
    };

    expect(schema.properties.quiz.minItems).toBe(2);
    expect(schema.properties.quiz.maxItems).toBe(2);
    expect(schema.properties.quiz.items.properties.options.minItems).toBe(4);
    expect(schema.properties.quiz.items.properties.options.maxItems).toBe(4);
  });

  it('requires an empty quiz array when quiz is disabled', () => {
    const schema = buildMaterialResponseSchema(noQuizSettings) as {
      properties: { quiz: { maxItems: number } };
    };

    expect(schema.properties.quiz.maxItems).toBe(0);
  });

  it('defines chunk map schema with processedText only', () => {
    const schema = buildChunkMapResponseSchema() as {
      required: string[];
      properties: Record<string, unknown>;
    };

    expect(schema.required).toEqual(['processedText']);
    expect(schema.properties).toEqual({ processedText: { type: 'string' } });
  });
});
