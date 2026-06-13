import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserController } from './user.controller';
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

describe('UserController', () => {
  let userController: UserController;

  const userService = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userService }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should return all users', async () => {
    userService.findAll.mockResolvedValue([mockUser]);

    const result = await userController.getUsers();

    expect(result).toEqual([
      {
        id: mockUser.id,
        firebaseUid: mockUser.firebaseUid,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      },
    ]);
  });

  it('should return a user by id', async () => {
    userService.findById.mockResolvedValue(mockUser);

    const result = await userController.getUserById(mockUser.id);

    expect(result.id).toBe(mockUser.id);
    expect(userService.findById).toHaveBeenCalledWith(mockUser.id);
  });

  it('should create a user', async () => {
    const createDto = {
      firebaseUid: mockUser.firebaseUid,
      email: mockUser.email,
    };
    userService.create.mockResolvedValue(mockUser);

    const result = await userController.createUser(createDto);

    expect(result.email).toBe(mockUser.email);
    expect(userService.create).toHaveBeenCalledWith(createDto);
  });

  it('should update a user', async () => {
    const updateDto = { email: 'updated@example.com' };
    const updatedUser = { ...mockUser, ...updateDto };
    userService.update.mockResolvedValue(updatedUser);

    const result = await userController.updateUser(mockUser.id, updateDto);

    expect(result.email).toBe(updateDto.email);
    expect(userService.update).toHaveBeenCalledWith(mockUser.id, updateDto);
  });

  it('should delete a user', async () => {
    userService.delete.mockResolvedValue(undefined);

    await userController.deleteUser(mockUser.id);

    expect(userService.delete).toHaveBeenCalledWith(mockUser.id);
  });
});
