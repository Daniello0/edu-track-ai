/** Chat message role accepted by OpenRouter chat completions. */
export type OpenRouterChatRole = 'system' | 'user' | 'assistant';

/** Single chat message for OpenRouter chat completions. */
export interface OpenRouterChatMessage {
  role: OpenRouterChatRole;
  content: string;
}

/** Strict JSON Schema response format for structured outputs. */
export interface OpenRouterJsonSchemaResponseFormat {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: true;
    schema: Record<string, unknown>;
  };
}

/** Provider preferences for OpenRouter routing. */
export interface OpenRouterProviderPreferences {
  require_parameters?: boolean;
}

/** Non-streaming chat completion request parameters. */
export interface OpenRouterChatCompletionCreateParams {
  model: string;
  messages: OpenRouterChatMessage[];
  response_format?: OpenRouterJsonSchemaResponseFormat;
  temperature?: number;
  stream?: false;
  provider?: OpenRouterProviderPreferences;
}

/** Chat completion message in the OpenRouter response. */
export interface OpenRouterChatCompletionMessage {
  content: string | null;
}

/** Single choice in an OpenRouter chat completion response. */
export interface OpenRouterChatCompletionChoice {
  message: OpenRouterChatCompletionMessage;
}

/** OpenRouter chat completion API response. */
export interface OpenRouterChatCompletion {
  choices: OpenRouterChatCompletionChoice[];
}
