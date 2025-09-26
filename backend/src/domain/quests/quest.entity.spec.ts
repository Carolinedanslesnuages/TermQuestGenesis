import { QuestEntity } from './quest.entity';

describe('QuestEntity', () => {
  describe('create', () => {
    it('should create a new quest entity with draft status and timestamps', () => {
      const quest = QuestEntity.create(
        '1',
        'Test Quest',
        'Test description',
        'user1',
      );

      expect(quest.id).toBe('1');
      expect(quest.title).toBe('Test Quest');
      expect(quest.description).toBe('Test description');
      expect(quest.status).toBe('draft');
      expect(quest.createdById).toBe('user1');
      expect(quest.createdAt).toBeInstanceOf(Date);
      expect(quest.updatedAt).toBeInstanceOf(Date);
      expect(quest.createdAt).toEqual(quest.updatedAt);
    });
  });

  describe('update', () => {
    it('should update quest with new updatedAt timestamp', async () => {
      const originalQuest = QuestEntity.create(
        '1',
        'Test Quest',
        'Test description',
        'user1',
      );

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      const updatedQuest = originalQuest.update(
        'New Title',
        'New description',
        'active',
      );

      expect(updatedQuest.id).toBe('1');
      expect(updatedQuest.title).toBe('New Title');
      expect(updatedQuest.description).toBe('New description');
      expect(updatedQuest.status).toBe('active');
      expect(updatedQuest.createdById).toBe('user1');
      expect(updatedQuest.createdAt).toEqual(originalQuest.createdAt);
      expect(updatedQuest.updatedAt.getTime()).toBeGreaterThan(
        originalQuest.updatedAt.getTime(),
      );
    });

    it('should keep original values when not provided', () => {
      const originalQuest = QuestEntity.create(
        '1',
        'Test Quest',
        'Test description',
        'user1',
      );
      const updatedQuest = originalQuest.update();

      expect(updatedQuest.title).toBe('Test Quest');
      expect(updatedQuest.description).toBe('Test description');
      expect(updatedQuest.status).toBe('draft');
    });
  });

  describe('changeStatus', () => {
    it('should change quest status', async () => {
      const originalQuest = QuestEntity.create(
        '1',
        'Test Quest',
        'Test description',
        'user1',
      );

      // Wait a bit to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      const activeQuest = originalQuest.changeStatus('active');

      expect(activeQuest.status).toBe('active');
      expect(activeQuest.updatedAt.getTime()).toBeGreaterThan(
        originalQuest.updatedAt.getTime(),
      );
    });
  });
});
