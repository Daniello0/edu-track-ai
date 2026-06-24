import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';

/** Single item in GET /api/library list responses. */
export interface LibraryItem {
  id: string;
  videoId: string;
  title: string;
  category: MaterialCategory;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: Language;
  status: MaterialStatus;
  bestScore: number;
  createdAt: string;
  lastViewedAt: string;
}

/** Response from GET /api/library. */
export interface LibraryListResponse {
  items: LibraryItem[];
}

/** Payload for PATCH /api/library/:id/status. */
export interface UpdateMaterialStatusRequest {
  status: MaterialStatus;
}

/** Dashboard stats derived from the user's library. */
export interface ProfileStats {
  totalMaterials: number;
  masteredCount: number;
  quizzesCompleted: number;
  favoriteCategory: MaterialCategory | null;
}
