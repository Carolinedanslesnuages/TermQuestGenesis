import { Quest, QuestStatus } from './quest.entity';

export interface IQuestRepository {
  findById(id: string): Promise<Quest | null>;
  findByStatus(status: QuestStatus): Promise<Quest[]>;
  findByCreatedById(createdById: string): Promise<Quest[]>;
  save(quest: Quest): Promise<Quest>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Quest[]>;
}
