import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import type { ReaderState } from '../../common/types/app.types';

const mockDeleteMaterial = vi.fn();

vi.mock('../profile/profile.service', () => ({
  deleteMaterial: (...args: unknown[]) => mockDeleteMaterial(...args),
}));

const persistedReader: ReaderState = {
  materialId: 'material-1',
  pendingId: null,
  videoId: 'video-1',
  title: 'Title',
  content: 'Content',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  quiz: null,
  isPersisted: true,
};

describe('reader-actions.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes persisted material through the profile service', async () => {
    mockDeleteMaterial.mockResolvedValue(undefined);
    const resetReader = vi.fn();
    const navigateHome = vi.fn();
    const setError = vi.fn();
    const setIsDeleting = vi.fn();

    const { deleteReaderMaterial } = await import('./reader-actions.utils');
    await deleteReaderMaterial(persistedReader, 'token', {
      resetReader,
      navigateHome,
      setError,
      setIsDeleting,
    });

    expect(mockDeleteMaterial).toHaveBeenCalledWith('material-1', 'token');
    expect(resetReader).toHaveBeenCalled();
    expect(navigateHome).toHaveBeenCalled();
  });

  it('clears guest reader without calling delete API', async () => {
    const resetReader = vi.fn();
    const navigateHome = vi.fn();
    const setError = vi.fn();
    const setIsDeleting = vi.fn();

    const { deleteReaderMaterial } = await import('./reader-actions.utils');
    await deleteReaderMaterial(
      { ...persistedReader, isPersisted: false, materialId: null },
      null,
      {
        resetReader,
        navigateHome,
        setError,
        setIsDeleting,
      },
    );

    expect(mockDeleteMaterial).not.toHaveBeenCalled();
    expect(resetReader).toHaveBeenCalled();
  });
});
