import { Language } from '../enums/language.enum';
import { MaterialCategory } from '../enums/material-category.enum';
import { MaterialFormat } from '../enums/material-format.enum';
import { SummaryLength } from '../enums/summary-length.enum';

/** Quiz question without server-only correct answer index. */
export interface QuizQuestionPublic {
  question: string;
  options: string[];
}

/** Shared material fields returned by process API. */
export interface MaterialPayload {
  videoId: string;
  title: string;
  content: string;
  category: MaterialCategory;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: Language;
  quiz: QuizQuestionPublic[] | null;
}

/** Guest session payload stored in sessionStorage. */
export interface PendingMaterial extends MaterialPayload {
  pendingId: string;
}

/** Reader state stored in Zustand after processing. */
export interface ReaderState {
  materialId: string | null;
  pendingId: string | null;
  videoId: string | null;
  title: string | null;
  content: string | null;
  category: MaterialCategory | null;
  format: MaterialFormat | null;
  summaryLength: SummaryLength | null;
  language: Language | null;
  quiz: QuizQuestionPublic[] | null;
  isPersisted: boolean;
}

/** Processing settings submitted with a video URL. */
export interface ProcessSettings {
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: Language;
  hasQuiz: boolean;
  quizQuestionsCount: number;
  quizOptionsCount: number;
}

/** Payload for POST /api/process. */
export interface ProcessRequest {
  videoUrl: string;
  settings: ProcessSettings;
}

/** Successful response from POST /api/process. */
export interface ProcessResponse extends MaterialPayload {
  id: string | null;
  pendingId?: string | null;
  isPersisted: boolean;
}

/** Main page form values before submission. */
export interface MainPageFormValues {
  videoUrl: string;
  format: MaterialFormat;
  summaryLength: SummaryLength;
  language: Language;
  hasQuiz: boolean;
  quizQuestionsCount: number;
  quizOptionsCount: number;
}
