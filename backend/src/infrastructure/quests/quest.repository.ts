import { Injectable } from '@nestjs/common';
import { Quest, QuestStatus } from '@domain/quests/quest.entity';
import { IQuestRepository } from '@domain/quests/quest.repository.interface';

@Injectable()
export class QuestRepository implements IQuestRepository {
  // In-memory storage for demo purposes
  // In real application, this would use TypeORM entities and database
  private quests: Quest[] = [];

  async findById(id: string): Promise<Quest | null> {
    return this.quests.find(quest => quest.id === id) || null;
  }

  async findByStatus(status: QuestStatus): Promise<Quest[]> {
    return this.quests.filter(quest => quest.status === status);
  }

  async findByCreatedById(createdById: string): Promise<Quest[]> {
    return this.quests.filter(quest => quest.createdById === createdById);
  }

  async save(quest: Quest): Promise<Quest> {
    const existingIndex = this.quests.findIndex(q => q.id === quest.id);
    if (existingIndex >= 0) {
      this.quests[existingIndex] = quest;
    } else {
      this.quests.push(quest);
    }
    return quest;
  }

  async delete(id: string): Promise<void> {
    this.quests = this.quests.filter(quest => quest.id !== id);
  }

  async findAll(): Promise<Quest[]> {
    return [...this.quests];
  }
}