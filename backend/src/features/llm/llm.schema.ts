import { MaterialCategory } from '../../common/enums/material-category.enum';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import {
  AI_CHUNK_MAP_RESPONSE_SCHEMA_NAME,
  AI_MATERIAL_RESPONSE_SCHEMA_NAME,
} from './llm.constants';

const MATERIAL_CATEGORY_ENUM = Object.values(MaterialCategory);

/**
 * Builds JSON Schema for structured output of a full material response.
 */
export function buildMaterialResponseSchema(
  settings: ProcessSettingsDto,
): Record<string, unknown> {
  const quizSchema = buildQuizSchema(settings);

  return {
    type: 'object',
    properties: {
      title: { type: 'string' },
      category: { type: 'string', enum: MATERIAL_CATEGORY_ENUM },
      processedText: { type: 'string' },
      quiz: quizSchema,
    },
    required: ['title', 'category', 'processedText', 'quiz'],
    additionalProperties: false,
  };
}

/**
 * Builds JSON Schema for structured output when mapping a transcript chunk.
 */
export function buildChunkMapResponseSchema(): Record<string, unknown> {
  return {
    type: 'object',
    properties: {
      processedText: { type: 'string' },
    },
    required: ['processedText'],
    additionalProperties: false,
  };
}

/**
 * Wraps a JSON Schema for OpenRouter `response_format.json_schema`.
 */
export function toStructuredJsonSchema(
  name: string,
  schema: Record<string, unknown>,
): {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: true;
    schema: Record<string, unknown>;
  };
} {
  return {
    type: 'json_schema',
    json_schema: {
      name,
      strict: true,
      schema,
    },
  };
}

/** Creates the response format for a full material LLM call. */
export function buildMaterialResponseFormat(settings: ProcessSettingsDto): {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: true;
    schema: Record<string, unknown>;
  };
} {
  return toStructuredJsonSchema(
    AI_MATERIAL_RESPONSE_SCHEMA_NAME,
    buildMaterialResponseSchema(settings),
  );
}

/** Creates the response format for a chunk map LLM call. */
export function buildChunkMapResponseFormat(): {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: true;
    schema: Record<string, unknown>;
  };
} {
  return toStructuredJsonSchema(
    AI_CHUNK_MAP_RESPONSE_SCHEMA_NAME,
    buildChunkMapResponseSchema(),
  );
}

function buildQuizSchema(
  settings: ProcessSettingsDto,
): Record<string, unknown> {
  if (!settings.hasQuiz) {
    return {
      type: 'array',
      items: buildQuizQuestionSchema(settings),
      maxItems: 0,
    };
  }

  return {
    type: 'array',
    items: buildQuizQuestionSchema(settings),
    minItems: settings.quizQuestionsCount,
    maxItems: settings.quizQuestionsCount,
  };
}

function buildQuizQuestionSchema(
  settings: ProcessSettingsDto,
): Record<string, unknown> {
  return {
    type: 'object',
    properties: {
      question: { type: 'string' },
      options: {
        type: 'array',
        items: { type: 'string' },
        minItems: settings.quizOptionsCount,
        maxItems: settings.quizOptionsCount,
      },
      correctIndex: { type: 'integer', minimum: 0 },
    },
    required: ['question', 'options', 'correctIndex'],
    additionalProperties: false,
  };
}
