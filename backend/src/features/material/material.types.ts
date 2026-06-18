import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';

/** Input for creating a persisted material row. */
export interface CreateMaterialInput {
  userId: string;
  videoId: string;
  settingsHash: string;
  title: string;
  content: string;
  category: MaterialCategory;
  format: MaterialFormat;
  summaryLength: SummaryLength | null;
  language: string;
  status?: MaterialStatus;
}
