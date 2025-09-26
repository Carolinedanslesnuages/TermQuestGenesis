import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../../application/users/user.service';
import { User } from '../../domain/users/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const mockUserService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers = [mockUser];
      userService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.findAll();

      expect(result).toEqual(expectedUsers);
      expect(userService.findAll).toHaveBeenCalled();
    });

    it('should throw HttpException when service fails', async () => {
      userService.findAll.mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      userService.findById.mockResolvedValue(mockUser);

      const result = await controller.findById('1');

      expect(result).toEqual(mockUser);
      expect(userService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw not found exception when user does not exist', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(controller.findById('1')).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw HttpException when service fails', async () => {
      userService.findById.mockRejectedValue(new Error('Service error'));

      await expect(controller.findById('1')).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      userService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockUser);

      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(mockUser);
    });

    it('should throw HttpException when service fails', async () => {
      userService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(mockUser)).rejects.toThrow(HttpException);
    });
  });
});
