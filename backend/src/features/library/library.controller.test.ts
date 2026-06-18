import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { Language } from '../../common/enums/language.enum';
import { AuthenticatedUser } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

const user: AuthenticatedUser = {
  userId: '550e8400-e29b-41d4-a716-446655440000',
};

const summary = {
  id: '660e8400-e29b-41d4-a716-446655440001',
  videoId: 'VIDEO_ID',
  title: 'TypeScript Basics',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.READ,
  isPersisted: true,
};

describe('LibraryController', () => {
  let libraryController: LibraryController;

  const libraryService = {
    getLibrary: vi.fn(),
    getMaterialDetail: vi.fn(),
    updateMaterialStatus: vi.fn(),
    deleteMaterial: vi.fn(),
    claimPending: vi.fn(),
    submitQuizAttempt: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [{ provide: LibraryService, useValue: libraryService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    libraryController = module.get(LibraryController);
  });

  it('returns library list for authenticated user', async () => {
    libraryService.getLibrary.mockResolvedValue({ items: [] });

    const result = await libraryController.getLibrary(user);

    expect(result.items).toEqual([]);
    expect(libraryService.getLibrary).toHaveBeenCalledWith(user.userId);
  });

  it('sets created status for new claim-pending result', async () => {
    libraryService.claimPending.mockResolvedValue({
      summary,
      created: true,
    });

    const response = { status: vi.fn() };
    const result = await libraryController.claimPending(
      user,
      { pendingId: 'pending-id' },
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(result).toEqual(summary);
  });

  it('sets ok status for deduplicated claim-pending result', async () => {
    libraryService.claimPending.mockResolvedValue({
      summary,
      created: false,
    });

    const response = { status: vi.fn() };
    await libraryController.claimPending(
      user,
      { pendingId: 'pending-id' },
      response as never,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
  });
});
