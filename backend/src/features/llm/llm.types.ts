import { MaterialCategory } from '../../common/enums/material-category.enum';
import { ProcessSettingsDto } from '../../common/dto/process/process-settings.dto';
import { QuizQuestion } from '../quiz/quiz.types';

/** Raw quiz question shape returned by Groq structured output. */
export interface AiQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

/** Raw structured output from Groq for a processed material. */
export interface AiMaterialResponse {
  title: string;
  category: MaterialCategory;
  processedText: string;
  quiz: AiQuizQuestion[];
}

/** Raw structured output from Groq when mapping a transcript chunk. */
export interface AiChunkMapResponse {
  processedText: string;
}

/** Input for the LLM processing pipeline. */
export interface LlmProcessInput {
  transcriptText: string;
  durationSeconds: number;
  settings: ProcessSettingsDto;
}

/** Mapped result ready for persistence and API responses. */
export interface LlmProcessResult {
  title: string;
  content: string;
  category: MaterialCategory;
  quiz: QuizQuestion[] | null;
}
