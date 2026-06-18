import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PENDING_MATERIAL_TTL_MS } from './pending.constants';
import {
  PendingMaterialRecord,
  StorePendingMaterialInput,
} from './pending.types';

@Injectable()
export class PendingService {
  private readonly records = new Map<string, PendingMaterialRecord>();

  /**
   * Stores guest material data and returns the generated pending id.
   */
  store(input: StorePendingMaterialInput): string {
    this.purgeExpired();

    const id = randomUUID();
    const record: PendingMaterialRecord = {
      id,
      ...input,
      expiresAt: new Date(Date.now() + PENDING_MATERIAL_TTL_MS),
    };

    this.records.set(id, record);
    return id;
  }

  /**
   * Returns a pending record without removing it.
   */
  findById(pendingId: string): PendingMaterialRecord | null {
    this.purgeExpired();
    return this.records.get(pendingId) ?? null;
  }

  /**
   * Removes and returns a pending record for claim-pending.
   */
  consume(pendingId: string): PendingMaterialRecord {
    this.purgeExpired();

    const record = this.records.get(pendingId);
    if (!record) {
      throw new NotFoundException(
        `Pending material with id "${pendingId}" not found`,
      );
    }

    this.records.delete(pendingId);
    return record;
  }

  private purgeExpired(): void {
    const now = Date.now();

    for (const [id, record] of this.records.entries()) {
      if (record.expiresAt.getTime() <= now) {
        this.records.delete(id);
      }
    }
  }
}
