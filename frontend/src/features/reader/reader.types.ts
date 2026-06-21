import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import type { QuizQuestionPublic } from '../../common/types/app.types';

/** Quiz attempt summary included in library material detail responses. */
export interface LibraryQuizAttemptSummary {
  id: string;
  score: number;
  createdAt: string;
}

/** Quiz details included in GET /api/library/:id responses. */
export interface LibraryQuizDetail {
  id: string;
  questions: QuizQuestionPublic[];
  bestScore: number;
  attempts: LibraryQuizAttemptSummary[];
}

/** Response from GET /api/library/:id. */
export interface LibraryDetailResponse {
  id: string;
  videoId: string;
  title: string;
  content: string;
  category: MaterialCategory;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: Language;
  status: MaterialStatus;
  quiz: LibraryQuizDetail | null;
  createdAt: string;
  lastViewedAt: string;
}

/** Minimal reader fields required to render the reading screen. */
export interface ReaderDisplayFields {
  title: string;
  content: string;
}
