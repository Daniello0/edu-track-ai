import { MaterialCategory } from '../enums/material-category.enum';
import { MaterialStatus } from '../enums/material-status.enum';

/** Mobile layout breakpoint per UI spec. */
export const MOBILE_BREAKPOINT_PX = 768;

/** Screen fade-in transition duration. */
export const PAGE_TRANSITION_MS = 300;

/** Expand/collapse transition for conditional settings blocks. */
export const COLLAPSIBLE_TRANSITION_MS = 250;

/** Localized labels for material categories. */
export const MATERIAL_CATEGORY_LABELS: Record<MaterialCategory, string> = {
  [MaterialCategory.PROGRAMMING]: 'Программирование',
  [MaterialCategory.MATHEMATICS]: 'Математика',
  [MaterialCategory.SCIENCE]: 'Наука',
  [MaterialCategory.HUMANITIES]: 'Гуманитарные науки',
  [MaterialCategory.LANGUAGES]: 'Языки',
  [MaterialCategory.BUSINESS]: 'Бизнес',
  [MaterialCategory.ARTS]: 'Искусство',
  [MaterialCategory.HEALTH]: 'Здоровье',
  [MaterialCategory.TECHNOLOGY]: 'Технологии',
  [MaterialCategory.OTHER]: 'Другое',
};

/** Localized labels and badge colors for material statuses. */
export const MATERIAL_STATUS_CONFIG: Record<
  MaterialStatus,
  { label: string; color: string }
> = {
  [MaterialStatus.READ]: { label: 'Прочитано', color: '#FFEAA7' },
  [MaterialStatus.RETAKE]: { label: 'Пересдача', color: '#FFB8B8' },
  [MaterialStatus.MASTERED]: { label: 'Усвоено', color: '#B2E2D4' },
};

/** Neutral badge background for category chips. */
export const CATEGORY_BADGE_BG = 'rgba(142, 142, 188, 0.25)';

/** localStorage key for theme preference. */
export const THEME_STORAGE_KEY = 'edutrack:theme';
