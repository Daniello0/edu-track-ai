import { resolveApiError } from '../../common/utils/api-error.utils';
import { fetchLibraryList } from './profile.service';
import type { LibraryItem, ProfileStats } from './profile.types';
import {
  computeProfileStats,
  sortLibraryItemsByLastViewed,
} from './profile.utils';

/** Loaded profile library payload for the dashboard UI. */
export interface ProfileLibraryData {
  items: LibraryItem[];
  stats: ProfileStats;
}

/** Callbacks invoked while loading profile library data. */
export interface ProfileLibraryHandlers {
  setItems: (items: LibraryItem[]) => void;
  setStats: (stats: ProfileStats) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Fetches and sorts the authenticated user's library for the profile page.
 */
export async function loadProfileLibrary(
  accessToken: string,
): Promise<ProfileLibraryData> {
  const response = await fetchLibraryList(accessToken);
  const items = sortLibraryItemsByLastViewed(response.items);

  return {
    items,
    stats: computeProfileStats(items),
  };
}

/**
 * Loads profile library data and applies it through UI handlers.
 */
export async function loadProfileLibraryData(
  accessToken: string,
  handlers: ProfileLibraryHandlers,
): Promise<void> {
  handlers.setIsLoading(true);
  handlers.setError(null);

  try {
    const data = await loadProfileLibrary(accessToken);
    handlers.setItems(data.items);
    handlers.setStats(data.stats);
  } catch (error) {
    handlers.setError(resolveApiError(error));
  } finally {
    handlers.setIsLoading(false);
  }
}
