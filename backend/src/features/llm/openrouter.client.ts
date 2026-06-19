import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_OPEN_ROUTER_MODEL,
  OPEN_ROUTER_API_KEY_ENV,
  OPEN_ROUTER_API_URL,
  OPEN_ROUTER_MODEL_ENV,
  OPEN_ROUTER_STRUCTURED_OUTPUT_PROVIDER,
} from './llm.constants';
import type {
  OpenRouterChatCompletion,
  OpenRouterChatCompletionCreateParams,
} from './openrouter.types';

/** Thin wrapper around the OpenRouter chat completions API for testability. */
@Injectable()
export class OpenRouterClient {
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(OPEN_ROUTER_API_KEY_ENV);
    if (!apiKey) {
      throw new Error(`Missing required env var: ${OPEN_ROUTER_API_KEY_ENV}`);
    }

    this.apiKey = apiKey;
    this.model =
      this.configService.get<string>(OPEN_ROUTER_MODEL_ENV) ??
      DEFAULT_OPEN_ROUTER_MODEL;
  }

  /** Returns the configured OpenRouter model identifier. */
  getModel(): string {
    return this.model;
  }

  /**
   * Creates a non-streaming chat completion via OpenRouter with strict
   * structured-output provider routing.
   */
  async createChatCompletion(
    params: Omit<OpenRouterChatCompletionCreateParams, 'model' | 'provider'>,
  ): Promise<OpenRouterChatCompletion> {
    const response = await fetch(OPEN_ROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        model: this.model,
        stream: false,
        provider: OPEN_ROUTER_STRUCTURED_OUTPUT_PROVIDER,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenRouter request failed with status ${response.status}`,
      );
    }

    return (await response.json()) as OpenRouterChatCompletion;
  }
}
