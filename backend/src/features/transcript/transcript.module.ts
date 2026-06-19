import { Module } from '@nestjs/common';
import { TranscriptController } from './transcript.controller';
import { TranscriptService } from './transcript.service';
import { YoutubeTranscriptClient } from './youtube-transcript.client';

@Module({
  controllers: [TranscriptController],
  providers: [YoutubeTranscriptClient, TranscriptService],
  exports: [TranscriptService],
})
export class TranscriptModule {}
