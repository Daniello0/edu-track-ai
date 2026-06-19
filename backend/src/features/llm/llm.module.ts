import { Module } from '@nestjs/common';
import { OpenRouterClient } from './openrouter.client';
import { LlmService } from './llm.service';

@Module({
  providers: [OpenRouterClient, LlmService],
  exports: [LlmService],
})
export class LlmModule {}
