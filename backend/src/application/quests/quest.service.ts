import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';
import { QuestRepository } from '../../infrastructure/quests/quest.repository';

/**
 * Quest application service
 * Provides application layer logic for quest operations
 */
@Injectable()
export class QuestService {
  constructor(
    @Inject('QuestRepository')
    private readonly questRepository: QuestRepository,
  ) {}

  /**
   * Find a quest by ID
   * @param id - The quest ID
   * @returns Promise that resolves to the quest or null if not found
   */
  async findById(id: string): Promise<Quest | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid quest ID provided');
    }
    return await this.questRepository.findById(id);
  }

  /**
   * Find all quests
   * @returns Promise that resolves to an array of all quests
   */
  async findAll(): Promise<Quest[]> {
    return await this.questRepository.findAll();
  }

  /**
   * Find quests by status
   * @param status - The quest status to filter by
   * @returns Promise that resolves to an array of quests with the specified status
   */
  async findByStatus(status: QuestStatus): Promise<Quest[]> {
    if (!this.isValidQuestStatus(status)) {
      throw new Error('Invalid quest status provided');
    }
    return await this.questRepository.findByStatus(status);
  }

  /**
   * Find quests by user ID
   * @param userId - The user ID who created the quests
   * @returns Promise that resolves to an array of quests created by the user
   */
  async findByUserId(userId: string): Promise<Quest[]> {
    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid user ID provided');
    }
    return await this.questRepository.findByUserId(userId);
  }

  /**
   * Create a new quest
   * @param quest - The quest to create
   * @returns Promise that resolves to the created quest
   */
  async create(quest: Quest): Promise<Quest> {
    if (!quest.title || !quest.description || !quest.createdById) {
      throw new Error('Title, description, and createdById are required');
    }

    if (quest.title.trim().length < 3) {
      throw new Error('Quest title must be at least 3 characters long');
    }

    if (quest.description.trim().length < 10) {
      throw new Error('Quest description must be at least 10 characters long');
    }

    if (quest.status && !this.isValidQuestStatus(quest.status)) {
      throw new Error('Invalid quest status provided');
    }

    return await this.questRepository.create(quest);
  }

  /**
   * Update an existing quest
   * @param id - The quest ID to update
   * @param quest - Partial quest data to update
   * @returns Promise that resolves to the updated quest
   */
  async update(id: string, quest: Partial<Quest>): Promise<Quest> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid quest ID provided');
    }

    const existingQuest = await this.questRepository.findById(id);
    if (!existingQuest) {
      throw new NotFoundException(`Quest with id ${id} not found`);
    }

    if (quest.title && quest.title.trim().length < 3) {
      throw new Error('Quest title must be at least 3 characters long');
    }

    if (quest.description && quest.description.trim().length < 10) {
      throw new Error('Quest description must be at least 10 characters long');
    }

    if (quest.status && !this.isValidQuestStatus(quest.status)) {
      throw new Error('Invalid quest status provided');
    }

    return await this.questRepository.update(id, quest);
  }

  /**
   * Delete a quest by ID
   * @param id - The quest ID to delete
   * @returns Promise that resolves when the quest is deleted
   */
  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid quest ID provided');
    }

    const existingQuest = await this.questRepository.findById(id);
    if (!existingQuest) {
      throw new NotFoundException(`Quest with id ${id} not found`);
    }

    await this.questRepository.delete(id);
  }

  /**
   * Private helper to validate quest status
   */
  private isValidQuestStatus(status: string): status is QuestStatus {
    return ['draft', 'active', 'completed', 'archived'].includes(status);
  }
}
