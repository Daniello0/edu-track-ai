/** Environment variable key for the Groq API key. */
export const GROQ_API_KEY_ENV = 'GROQ_API_KEY';

/** Environment variable key for the Groq model identifier. */
export const GROQ_MODEL_ENV = 'GROQ_MODEL';

/** Default Groq model supporting structured JSON output. */
export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';

/** Videos longer than this threshold use chunking + MapReduce. */
export const LONG_VIDEO_THRESHOLD_SECONDS = 45 * 60; // 45 minutes

/** Maximum characters per transcript chunk during MapReduce. */
export const TRANSCRIPT_CHUNK_MAX_CHARS = 12_000;

/** JSON Schema name for the full AI material response. */
export const AI_MATERIAL_RESPONSE_SCHEMA_NAME = 'material_response';

/** JSON Schema name for a single chunk map response. */
export const AI_CHUNK_MAP_RESPONSE_SCHEMA_NAME = 'chunk_map_response';

/** Temperature for the Groq model. */
export const CONFIG_TEMPERATURE = 0.2;

/** User-facing message when Groq returns an empty completion. */
export const LLM_EMPTY_RESPONSE_MESSAGE =
  'AI не вернул результат обработки. Попробуйте ещё раз.';

/** User-facing message when Groq response JSON is invalid. */
export const LLM_INVALID_RESPONSE_MESSAGE =
  'AI вернул некорректный ответ. Попробуйте ещё раз.';

/** User-facing message when Groq API call fails. */
export const LLM_PROCESSING_FAILED_MESSAGE =
  'Не удалось обработать материал через AI. Попробуйте позже.';
