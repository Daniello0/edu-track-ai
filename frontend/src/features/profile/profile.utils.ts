import * as yup from 'yup';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { PROFILE_DATE_LOCALE } from './profile.constants';
import { updateMaterialStatusSchema } from './profile.schema';
import type {
  LibraryItem,
  ProfileStats,
  UpdateMaterialStatusRequest,
} from './profile.types';

/**
 * Formats an ISO date for library cards in the profile grid.
 */
export function formatLibraryItemDate(isoDate: string): string {
  return new Intl.DateTimeFormat(PROFILE_DATE_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));
}

/**
 * Sorts library items by most recently viewed first.
 */
export function sortLibraryItemsByLastViewed(
  items: LibraryItem[],
): LibraryItem[] {
  return [...items].sort(
    (left, right) =>
      new Date(right.lastViewedAt).getTime() -
      new Date(left.lastViewedAt).getTime(),
  );
}

/**
 * Computes dashboard stats from a library item list.
 */
export function computeProfileStats(items: LibraryItem[]): ProfileStats {
  const masteredCount = items.filter(
    (item) => item.status === MaterialStatus.MASTERED,
  ).length;
  const quizzesCompleted = items.filter((item) => item.bestScore > 0).length;

  return {
    totalMaterials: items.length,
    masteredCount,
    quizzesCompleted,
    favoriteCategory: resolveFavoriteCategory(items),
  };
}

/**
 * Validates material status update payload and returns the first error, if any.
 */
export async function validateUpdateMaterialStatus(
  payload: UpdateMaterialStatusRequest,
): Promise<string | null> {
  try {
    await updateMaterialStatusSchema.validate(payload, { abortEarly: true });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }

    throw error;
  }
}

function resolveFavoriteCategory(
  items: LibraryItem[],
): MaterialCategory | null {
  if (items.length === 0) {
    return null;
  }

  const counts = new Map<MaterialCategory, number>();

  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }

  let favoriteCategory: MaterialCategory | null = null;
  let maxCount = 0;

  for (const [category, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      favoriteCategory = category;
    }
  }

  return favoriteCategory;
}
