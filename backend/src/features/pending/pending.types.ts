import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import { QuizQuestion } from '../quiz/quiz.types';

/** Payload stored in the temporary pending store for guest sessions. */
export interface PendingMaterialData {
  videoId: string;
  settingsHash: string;
  title: string;
  content: string;
  category: MaterialCategory;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: string;
  questions: QuizQuestion[];
}

/** Pending material entry including server-side metadata. */
export interface PendingMaterialRecord extends PendingMaterialData {
  id: string;
  expiresAt: Date;
}

/** Input for storing a guest material before claim-pending. */
export type StorePendingMaterialInput = PendingMaterialData;
