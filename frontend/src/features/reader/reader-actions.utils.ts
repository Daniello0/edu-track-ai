import { resolveApiError } from '../../common/utils/api-error.utils';
import type { ReaderState } from '../../common/types/app.types';
import { deleteMaterial } from '../profile/profile.service';

/** Callbacks invoked after deleting reader material. */
export interface DeleteReaderMaterialHandlers {
  resetReader: () => void;
  navigateHome: () => void;
  setError: (error: string | null) => void;
  setIsDeleting: (isDeleting: boolean) => void;
}

/**
 * Deletes a persisted material from the library or clears a guest session.
 */
export async function deleteReaderMaterial(
  reader: ReaderState,
  accessToken: string | null,
  handlers: DeleteReaderMaterialHandlers,
): Promise<void> {
  handlers.setIsDeleting(true);
  handlers.setError(null);

  try {
    if (
      reader.isPersisted &&
      reader.materialId !== null &&
      accessToken !== null
    ) {
      await deleteMaterial(reader.materialId, accessToken);
    }

    handlers.resetReader();
    handlers.navigateHome();
  } catch (error) {
    handlers.setError(resolveApiError(error));
  } finally {
    handlers.setIsDeleting(false);
  }
}
