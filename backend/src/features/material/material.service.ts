import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { DEFAULT_MATERIAL_STATUS } from './material.constants';
import { Material } from './material.entity';
import { CreateMaterialInput } from './material.types';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  /**
   * Returns all materials owned by the user, newest by last view first.
   */
  async findAllByUserId(userId: string): Promise<Material[]> {
    return this.materialRepository.find({
      where: { userId },
      relations: { quiz: true },
      order: { lastViewedAt: 'DESC' },
    });
  }

  /**
   * Returns a material owned by the user or throws when not found.
   */
  async findByIdForUser(userId: string, materialId: string): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: { id: materialId, userId },
      relations: { quiz: { attempts: true } },
    });

    if (!material) {
      throw new NotFoundException(`Material with id "${materialId}" not found`);
    }

    return material;
  }

  /**
   * Finds a material by user and settings hash for deduplication.
   */
  async findByUserAndSettingsHash(
    userId: string,
    settingsHash: string,
  ): Promise<Material | null> {
    return this.materialRepository.findOne({
      where: { userId, settingsHash },
    });
  }

  /**
   * Persists a new material for the given user.
   */
  async create(
    input: CreateMaterialInput,
    manager?: EntityManager,
  ): Promise<Material> {
    const repository = this.getRepository(manager);
    const material = repository.create({
      ...input,
      status: input.status ?? DEFAULT_MATERIAL_STATUS,
    });

    return repository.save(material);
  }

  /**
   * Updates the mastery status of a material owned by the user.
   */
  async updateStatus(
    userId: string,
    materialId: string,
    status: MaterialStatus,
  ): Promise<Material> {
    const material = await this.findByIdForUser(userId, materialId);
    material.status = status;
    return this.materialRepository.save(material);
  }

  /**
   * Updates last_viewed_at to the current timestamp.
   */
  async touchLastViewedAt(
    userId: string,
    materialId: string,
  ): Promise<Material> {
    const material = await this.findByIdForUser(userId, materialId);
    material.lastViewedAt = new Date();
    return this.materialRepository.save(material);
  }

  /**
   * Deletes a material owned by the user.
   */
  async deleteForUser(userId: string, materialId: string): Promise<void> {
    const material = await this.findByIdForUser(userId, materialId);
    await this.materialRepository.remove(material);
  }

  private getRepository(manager?: EntityManager): Repository<Material> {
    return manager?.getRepository(Material) ?? this.materialRepository;
  }
}
