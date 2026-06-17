import { Module } from '@nestjs/common';
import { TranscriptService } from './transcript.service';
import { YoutubeTranscriptClient } from './youtube-transcript.client';

@Module({
  providers: [YoutubeTranscriptClient, TranscriptService],
  exports: [TranscriptService],
})
export class TranscriptModule {}
