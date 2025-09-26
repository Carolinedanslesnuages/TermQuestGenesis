import { Quest, QuestStatus } from '../../domain/quests/quest.entity';

/**
 * Quest repository contract
 * Defines the interface for quest data access operations
 */
export interface QuestRepository {
  /**
   * Find a quest by ID
   * @param id - The quest ID
   * @returns Promise that resolves to the quest or null if not found
   */
  findById(id: string): Promise<Quest | null>;

  /**
   * Find all quests
   * @returns Promise that resolves to an array of all quests
   */
  findAll(): Promise<Quest[]>;

  /**
   * Find quests by status
   * @param status - The quest status to filter by
   * @returns Promise that resolves to an array of quests with the specified status
   */
  findByStatus(status: QuestStatus): Promise<Quest[]>;

  /**
   * Find quests by user ID
   * @param userId - The user ID who created the quests
   * @returns Promise that resolves to an array of quests created by the user
   */
  findByUserId(userId: string): Promise<Quest[]>;

  /**
   * Create a new quest
   * @param quest - The quest to create
   * @returns Promise that resolves to the created quest
   */
  create(quest: Quest): Promise<Quest>;

  /**
   * Update an existing quest
   * @param id - The quest ID to update
   * @param quest - Partial quest data to update
   * @returns Promise that resolves to the updated quest
   */
  update(id: string, quest: Partial<Quest>): Promise<Quest>;

  /**
   * Delete a quest by ID
   * @param id - The quest ID to delete
   * @returns Promise that resolves when the quest is deleted
   */
  delete(id: string): Promise<void>;
}
