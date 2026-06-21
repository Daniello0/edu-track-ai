import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';

/** Payload for POST /api/library/claim-pending. */
export interface ClaimPendingRequest {
  pendingId: string;
}

/** Response from POST /api/library/claim-pending. */
export interface MaterialSummaryResponse {
  id: string;
  videoId: string;
  title: string;
  category: MaterialCategory;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: Language;
  status: MaterialStatus;
  isPersisted: boolean;
}
