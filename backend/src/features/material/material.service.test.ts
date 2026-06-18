import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { Language } from '../../common/enums/language.enum';
import { Material } from './material.entity';
import { MaterialService } from './material.service';

const userId = '550e8400-e29b-41d4-a716-446655440000';
const materialId = '660e8400-e29b-41d4-a716-446655440001';

const mockMaterial: Material = {
  id: materialId,
  userId,
  videoId: 'VIDEO_ID',
  settingsHash: 'hash-123',
  title: 'TypeScript Basics',
  content: '# Content',
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  status: MaterialStatus.READ,
  createdAt: new Date('2026-06-11T10:00:00.000Z'),
  lastViewedAt: new Date('2026-06-11T12:00:00.000Z'),
  user: {} as Material['user'],
  quiz: {} as Material['quiz'],
};

describe('MaterialService', () => {
  let materialService: MaterialService;

  const materialRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    materialRepository.create.mockImplementation(
      (payload: Partial<Material>) => payload,
    );
    materialRepository.save.mockImplementation((payload: Partial<Material>) =>
      Promise.resolve({ ...mockMaterial, ...payload }),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialService,
        {
          provide: getRepositoryToken(Material),
          useValue: materialRepository,
        },
      ],
    }).compile();

    materialService = module.get(MaterialService);
  });

  it('returns materials for a user', async () => {
    materialRepository.find.mockResolvedValue([mockMaterial]);

    const result = await materialService.findAllByUserId(userId);

    expect(result).toEqual([mockMaterial]);
    expect(materialRepository.find).toHaveBeenCalledWith({
      where: { userId },
      relations: { quiz: true },
      order: { lastViewedAt: 'DESC' },
    });
  });

  it('throws when material is not owned by user', async () => {
    materialRepository.findOne.mockResolvedValue(null);

    await expect(
      materialService.findByIdForUser(userId, materialId),
    ).rejects.toThrow(NotFoundException);
  });

  it('updates material status', async () => {
    materialRepository.findOne.mockResolvedValue({ ...mockMaterial });

    const result = await materialService.updateStatus(
      userId,
      materialId,
      MaterialStatus.MASTERED,
    );

    expect(result.status).toBe(MaterialStatus.MASTERED);
  });

  it('deletes an owned material', async () => {
    materialRepository.findOne.mockResolvedValue({ ...mockMaterial });
    materialRepository.remove.mockResolvedValue(undefined);

    await materialService.deleteForUser(userId, materialId);

    expect(materialRepository.remove).toHaveBeenCalled();
  });
});
