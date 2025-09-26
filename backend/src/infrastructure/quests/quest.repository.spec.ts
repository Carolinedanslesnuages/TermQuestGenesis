import { QuestRepository } from './quest.repository';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';

describe('QuestRepository', () => {
  it('should define the contract interface', () => {
    // This test validates that the interface is properly defined
    // and can be used for type checking
    const mockRepository: QuestRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    expect(mockRepository).toBeDefined();
    expect(typeof mockRepository.findById).toBe('function');
    expect(typeof mockRepository.findAll).toBe('function');
    expect(typeof mockRepository.findByStatus).toBe('function');
    expect(typeof mockRepository.findByUserId).toBe('function');
    expect(typeof mockRepository.create).toBe('function');
    expect(typeof mockRepository.update).toBe('function');
    expect(typeof mockRepository.delete).toBe('function');
  });

  it('should have correct method signatures', () => {
    // Type assertion test to ensure interface compliance
    const mockQuest: Quest = {
      id: '1',
      title: 'Test Quest',
      description: 'Test description',
      status: 'draft',
      createdById: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const mockRepository: QuestRepository = {
      findById: (_id: string): Promise<Quest | null> =>
        Promise.resolve(mockQuest),
      findAll: (): Promise<Quest[]> => Promise.resolve([mockQuest]),
      findByStatus: (_status: QuestStatus): Promise<Quest[]> =>
        Promise.resolve([mockQuest]),
      findByUserId: (_userId: string): Promise<Quest[]> =>
        Promise.resolve([mockQuest]),
      create: (quest: Quest): Promise<Quest> => Promise.resolve(quest),
      update: (_id: string, quest: Partial<Quest>): Promise<Quest> =>
        Promise.resolve({ ...mockQuest, ...quest }),
      delete: (_id: string): Promise<void> => Promise.resolve(),
    };
    /* eslint-enable @typescript-eslint/no-unused-vars */

    expect(mockRepository).toBeDefined();
  });
});
