import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { User } from './user.entity';
import { UserService } from './user.service';

const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  firebaseUid: 'firebase-uid-abc123',
  email: 'user@example.com',
  createdAt: new Date('2026-06-13T10:00:00.000Z'),
  refreshTokens: [],
  materials: [],
};

describe('UserService', () => {
  let userService: UserService;

  const userRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should return all users', async () => {
    userRepository.find.mockResolvedValue([mockUser]);

    const result = await userService.findAll();

    expect(result).toEqual([mockUser]);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    userRepository.findOne.mockResolvedValue(mockUser);

    const result = await userService.findById(mockUser.id);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
  });

  it('should throw NotFoundException when user is missing', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(userService.findById('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a user', async () => {
    const createDto = {
      firebaseUid: mockUser.firebaseUid,
      email: mockUser.email,
    };
    userRepository.create.mockReturnValue(createDto);
    userRepository.save.mockResolvedValue(mockUser);

    const result = await userService.create(createDto);

    expect(result).toEqual(mockUser);
    expect(userRepository.create).toHaveBeenCalledWith(createDto);
    expect(userRepository.save).toHaveBeenCalledWith(createDto);
  });

  it('should update a user', async () => {
    const updateDto = { email: 'updated@example.com' };
    const updatedUser = { ...mockUser, ...updateDto };
    userRepository.findOne.mockResolvedValue(mockUser);
    userRepository.save.mockResolvedValue(updatedUser);

    const result = await userService.update(mockUser.id, updateDto);

    expect(result).toEqual(updatedUser);
    expect(userRepository.save).toHaveBeenCalledWith({
      ...mockUser,
      ...updateDto,
    });
  });

  it('should delete a user', async () => {
    userRepository.findOne.mockResolvedValue(mockUser);
    userRepository.delete.mockResolvedValue({ affected: 1 });

    await userService.delete(mockUser.id);

    expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
  });
});
