/** Environment variable key for the OpenRouter API key. */
export const OPEN_ROUTER_API_KEY_ENV = 'OPEN_ROUTER_API_KEY';

/** Environment variable key for the OpenRouter model identifier. */
export const OPEN_ROUTER_MODEL_ENV = 'OPEN_ROUTER_MODEL';

/** Default OpenRouter model supporting structured JSON output. */
export const DEFAULT_OPEN_ROUTER_MODEL = 'openrouter/free';

/** OpenRouter chat completions endpoint. */
export const OPEN_ROUTER_API_URL =
  'https://openrouter.ai/api/v1/chat/completions';

/**
 * Routes requests only to providers that support every request parameter,
 * including strict JSON Schema structured outputs.
 */
export const OPEN_ROUTER_STRUCTURED_OUTPUT_PROVIDER = {
  require_parameters: true,
} as const;

/** Videos longer than this threshold use chunking + MapReduce. */
export const LONG_VIDEO_THRESHOLD_SECONDS = 45 * 60; // 45 minutes

/** Maximum characters per transcript chunk during MapReduce. */
export const TRANSCRIPT_CHUNK_MAX_CHARS = 12_000;

/** JSON Schema name for the full AI material response. */
export const AI_MATERIAL_RESPONSE_SCHEMA_NAME = 'material_response';

/** JSON Schema name for a single chunk map response. */
export const AI_CHUNK_MAP_RESPONSE_SCHEMA_NAME = 'chunk_map_response';

/** Temperature for the LLM model. */
export const CONFIG_TEMPERATURE = 0.2;

/** User-facing message when the LLM returns an empty completion. */
export const LLM_EMPTY_RESPONSE_MESSAGE =
  'AI не вернул результат обработки. Попробуйте ещё раз.';

/** User-facing message when the LLM response JSON is invalid. */
export const LLM_INVALID_RESPONSE_MESSAGE =
  'AI вернул некорректный ответ. Попробуйте ещё раз.';

/** User-facing message when the LLM API call fails. */
export const LLM_PROCESSING_FAILED_MESSAGE =
  'Не удалось обработать материал через AI. Попробуйте позже.';
