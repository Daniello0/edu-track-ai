import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../common/dto/user/create-user.dto';
import { UpdateUserDto } from '../../common/dto/user/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Returns all user records from the database.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Returns a single user by primary key.
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  /**
   * Persists a new user record.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  /**
   * Updates an existing user record.
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    return this.userRepository.save({ ...user, ...dto });
  }

  /**
   * Creates a user or updates email when the Firebase account already exists.
   */
  async upsertByFirebaseUid(firebaseUid: string, email: string): Promise<User> {
    const existing = await this.findByFirebaseUid(firebaseUid);

    if (existing) {
      if (existing.email === email) {
        return existing;
      }
      return this.userRepository.save({ ...existing, email });
    }

    return this.createByFirebaseUid(firebaseUid, email);
  }

  /**
   * Removes a user record by primary key.
   */
  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }

  /**
   * Returns a single user by Firebase UID.
   */
  private async findByFirebaseUid(
    firebaseUid: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { firebaseUid },
    });
    return user ?? undefined;
  }

  private async createByFirebaseUid(
    firebaseUid: string,
    email: string,
  ): Promise<User> {
    return this.userRepository.save(
      this.userRepository.create({ firebaseUid, email }),
    );
  }
}
