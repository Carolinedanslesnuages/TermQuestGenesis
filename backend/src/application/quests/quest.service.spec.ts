import { QuestService } from './quest.service';
import { QuestRepository } from '../../infrastructure/quests/quest.repository';
import { Quest } from '../../domain/quests/quest.entity';
import { NotFoundException } from '@nestjs/common';

describe('QuestService', () => {
  let questService: QuestService;
  let mockQuestRepository: jest.Mocked<QuestRepository>;

  beforeEach(() => {
    mockQuestRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    questService = new QuestService(mockQuestRepository);
  });

  it('should be defined', () => {
    expect(questService).toBeDefined();
  });

  it('should have findById method', () => {
    expect(typeof questService.findById).toBe('function');
  });

  it('should have findAll method', () => {
    expect(typeof questService.findAll).toBe('function');
  });

  it('should have findByStatus method', () => {
    expect(typeof questService.findByStatus).toBe('function');
  });

  it('should have findByUserId method', () => {
    expect(typeof questService.findByUserId).toBe('function');
  });

  it('should have create method', () => {
    expect(typeof questService.create).toBe('function');
  });

  it('should have update method', () => {
    expect(typeof questService.update).toBe('function');
  });

  it('should have delete method', () => {
    expect(typeof questService.delete).toBe('function');
  });

  describe('findById', () => {
    it('should call repository findById and return quest', async () => {
      const mockQuest: Quest = {
        id: '1',
        title: 'Test Quest',
        description: 'Test description',
        status: 'draft',
        createdById: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockQuestRepository.findById.mockResolvedValue(mockQuest);

      const result = await questService.findById('1');

      expect(mockQuestRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockQuest);
    });

    it('should throw error for invalid ID', async () => {
      await expect(questService.findById('')).rejects.toThrow('Invalid quest ID provided');
    });
  });

  describe('findAll', () => {
    it('should call repository findAll and return quests', async () => {
      const mockQuests: Quest[] = [];
      mockQuestRepository.findAll.mockResolvedValue(mockQuests);

      const result = await questService.findAll();

      expect(mockQuestRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockQuests);
    });
  });

  describe('findByStatus', () => {
    it('should call repository findByStatus with valid status', async () => {
      const mockQuests: Quest[] = [];
      mockQuestRepository.findByStatus.mockResolvedValue(mockQuests);

      const result = await questService.findByStatus('draft');

      expect(mockQuestRepository.findByStatus).toHaveBeenCalledWith('draft');
      expect(result).toEqual(mockQuests);
    });

    it('should throw error for invalid status', async () => {
      await expect(questService.findByStatus('invalid' as any)).rejects.toThrow('Invalid quest status provided');
    });
  });

  describe('findByUserId', () => {
    it('should call repository findByUserId with valid user ID', async () => {
      const mockQuests: Quest[] = [];
      mockQuestRepository.findByUserId.mockResolvedValue(mockQuests);

      const result = await questService.findByUserId('user1');

      expect(mockQuestRepository.findByUserId).toHaveBeenCalledWith('user1');
      expect(result).toEqual(mockQuests);
    });

    it('should throw error for invalid user ID', async () => {
      await expect(questService.findByUserId('')).rejects.toThrow('Invalid user ID provided');
    });
  });

  describe('create', () => {
    it('should create quest with valid data', async () => {
      const mockQuest: Quest = {
        id: '1',
        title: 'Test Quest',
        description: 'Test description for the quest',
        status: 'draft',
        createdById: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockQuestRepository.create.mockResolvedValue(mockQuest);

      const result = await questService.create(mockQuest);

      expect(mockQuestRepository.create).toHaveBeenCalledWith(mockQuest);
      expect(result).toEqual(mockQuest);
    });

    it('should throw error for missing required fields', async () => {
      const mockQuest: Quest = {
        id: '1',
        title: '',
        description: 'Test description',
        status: 'draft',
        createdById: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(questService.create(mockQuest)).rejects.toThrow('Title, description, and createdById are required');
    });

    it('should throw error for short title', async () => {
      const mockQuest: Quest = {
        id: '1',
        title: 'AB',
        description: 'Test description for the quest',
        status: 'draft',
        createdById: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(questService.create(mockQuest)).rejects.toThrow('Quest title must be at least 3 characters long');
    });

    it('should throw error for short description', async () => {
      const mockQuest: Quest = {
        id: '1',
        title: 'Test Quest',
        description: 'Short',
        status: 'draft',
        createdById: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await expect(questService.create(mockQuest)).rejects.toThrow('Quest description must be at least 10 characters long');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException for non-existent quest', async () => {
      mockQuestRepository.findById.mockResolvedValue(null);

      await expect(
        questService.update('1', { title: 'Updated Quest' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid ID', async () => {
      await expect(questService.update('', { title: 'Updated Quest' })).rejects.toThrow('Invalid quest ID provided');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException for non-existent quest', async () => {
      mockQuestRepository.findById.mockResolvedValue(null);

      await expect(questService.delete('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid ID', async () => {
      await expect(questService.delete('')).rejects.toThrow('Invalid quest ID provided');
    });
  });
});
