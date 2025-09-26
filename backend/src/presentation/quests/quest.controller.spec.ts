import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { QuestController } from './quest.controller';
import { QuestService } from '../../application/quests/quest.service';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';

describe('QuestController', () => {
  let controller: QuestController;
  let questService: jest.Mocked<QuestService>;

  const mockQuest: Quest = {
    id: '1',
    title: 'Test Quest',
    description: 'Test description',
    status: 'draft' as QuestStatus,
    createdById: 'user1',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const mockQuestService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStatus: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestController],
      providers: [
        {
          provide: QuestService,
          useValue: mockQuestService,
        },
      ],
    }).compile();

    controller = module.get<QuestController>(QuestController);
    questService = module.get(QuestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all quests when no status filter', async () => {
      const expectedQuests = [mockQuest];
      questService.findAll.mockResolvedValue(expectedQuests);

      const result = await controller.findAll();

      expect(result).toEqual(expectedQuests);
      expect(questService.findAll).toHaveBeenCalled();
      expect(questService.findByStatus).not.toHaveBeenCalled();
    });

    it('should return filtered quests when status provided', async () => {
      const expectedQuests = [mockQuest];
      questService.findByStatus.mockResolvedValue(expectedQuests);

      const result = await controller.findAll('active');

      expect(result).toEqual(expectedQuests);
      expect(questService.findByStatus).toHaveBeenCalledWith('active');
      expect(questService.findAll).not.toHaveBeenCalled();
    });

    it('should throw HttpException when service fails', async () => {
      questService.findAll.mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return a quest when found', async () => {
      questService.findById.mockResolvedValue(mockQuest);

      const result = await controller.findById('1');

      expect(result).toEqual(mockQuest);
      expect(questService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw not found exception when quest does not exist', async () => {
      questService.findById.mockResolvedValue(null);

      await expect(controller.findById('1')).rejects.toThrow(
        new HttpException('Quest not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw HttpException when service fails', async () => {
      questService.findById.mockRejectedValue(new Error('Service error'));

      await expect(controller.findById('1')).rejects.toThrow(HttpException);
    });
  });

  describe('findByUserId', () => {
    it('should return quests for a user', async () => {
      const expectedQuests = [mockQuest];
      questService.findByUserId.mockResolvedValue(expectedQuests);

      const result = await controller.findByUserId('user1');

      expect(result).toEqual(expectedQuests);
      expect(questService.findByUserId).toHaveBeenCalledWith('user1');
    });

    it('should throw HttpException when service fails', async () => {
      questService.findByUserId.mockRejectedValue(new Error('Service error'));

      await expect(controller.findByUserId('user1')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a quest', async () => {
      questService.create.mockResolvedValue(mockQuest);

      const result = await controller.create(mockQuest);

      expect(result).toEqual(mockQuest);
      expect(questService.create).toHaveBeenCalledWith(mockQuest);
    });

    it('should throw HttpException when service fails', async () => {
      questService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(mockQuest)).rejects.toThrow(HttpException);
    });
  });
});
