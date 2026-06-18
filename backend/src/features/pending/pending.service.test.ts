import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { Language } from '../../common/enums/language.enum';
import { PendingService } from './pending.service';

describe('PendingService', () => {
  let pendingService: PendingService;

  beforeEach(() => {
    pendingService = new PendingService();
  });

  it('stores and consumes a pending material', () => {
    const pendingId = pendingService.store({
      videoId: 'VIDEO_ID',
      settingsHash: 'hash-123',
      title: 'Title',
      content: '# Content',
      category: MaterialCategory.PROGRAMMING,
      format: MaterialFormat.NARRATIVE,
      summaryLength: null,
      language: Language.RU,
      questions: [],
    });

    const consumed = pendingService.consume(pendingId);

    expect(consumed.settingsHash).toBe('hash-123');
    expect(pendingService.findById(pendingId)).toBeNull();
  });

  it('throws when consuming an unknown pending id', () => {
    expect(() => pendingService.consume('missing-id')).toThrow(
      NotFoundException,
    );
  });
});
