import { UserService } from './user.service';
import { UserRepository } from '../../infrastructure/users/user.repository';
import { User } from '../../domain/users/user.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(mockUserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should have findById method', () => {
    expect(typeof userService.findById).toBe('function');
  });

  it('should have findAll method', () => {
    expect(typeof userService.findAll).toBe('function');
  });

  it('should have create method', () => {
    expect(typeof userService.create).toBe('function');
  });

  it('should have update method', () => {
    expect(typeof userService.update).toBe('function');
  });

  it('should have delete method', () => {
    expect(typeof userService.delete).toBe('function');
  });

  describe('findById', () => {
    it('should call repository findById and return user', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById('1');

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid ID', async () => {
      await expect(userService.findById('')).rejects.toThrow('Invalid user ID provided');
    });
  });

  describe('findAll', () => {
    it('should call repository findAll and return users', async () => {
      const mockUsers: User[] = [];
      mockUserRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.findAll();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('create', () => {
    it('should create user with valid data', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await userService.create(mockUser);

      expect(mockUserRepository.create).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw error for missing email', async () => {
      const mockUser: User = {
        id: '1',
        email: '',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(userService.create(mockUser)).rejects.toThrow('Email and username are required');
    });

    it('should throw error for invalid email format', async () => {
      const mockUser: User = {
        id: '1',
        email: 'invalid-email',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(userService.create(mockUser)).rejects.toThrow('Invalid email format');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException for non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.update('1', { email: 'new@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid email format', async () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      await expect(
        userService.update('1', { email: 'invalid-email' }),
      ).rejects.toThrow('Invalid email format');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException for non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.delete('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid ID', async () => {
      await expect(userService.delete('')).rejects.toThrow('Invalid user ID provided');
    });
  });
});
