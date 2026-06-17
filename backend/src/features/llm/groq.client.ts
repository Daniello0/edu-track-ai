import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import type {
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from 'groq-sdk/resources/chat/completions';
import {
  DEFAULT_GROQ_MODEL,
  GROQ_API_KEY_ENV,
  GROQ_MODEL_ENV,
} from './llm.constants';

/** Thin wrapper around the Groq SDK for testability. */
@Injectable()
export class GroqClient {
  private readonly client: Groq;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(GROQ_API_KEY_ENV);
    if (!apiKey) {
      throw new Error(`Missing required env var: ${GROQ_API_KEY_ENV}`);
    }

    this.client = new Groq({ apiKey });
    this.model =
      this.configService.get<string>(GROQ_MODEL_ENV) ?? DEFAULT_GROQ_MODEL;
  }

  /** Returns the configured Groq model identifier. */
  getModel(): string {
    return this.model;
  }

  /**
   * Creates a non-streaming chat completion via Groq.
   */
  createChatCompletion(
    params: Omit<ChatCompletionCreateParamsNonStreaming, 'model'>,
  ): Promise<ChatCompletion> {
    return this.client.chat.completions.create({
      ...params,
      model: this.model,
      stream: false,
    });
  }
}
