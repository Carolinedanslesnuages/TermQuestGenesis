import { Injectable, Inject } from '@nestjs/common';
import { Quest, QuestStatus } from '@domain/quests/quest.entity';
import { IQuestRepository } from '@domain/quests/quest.repository.interface';

@Injectable()
export class GetQuestService {
  constructor(
    @Inject('IQuestRepository')
    private readonly questRepository: IQuestRepository,
  ) {}

  async byId(id: string): Promise<Quest | null> {
    return await this.questRepository.findById(id);
  }

  async byStatus(status: QuestStatus): Promise<Quest[]> {
    return await this.questRepository.findByStatus(status);
  }

  async byCreatedById(createdById: string): Promise<Quest[]> {
    return await this.questRepository.findByCreatedById(createdById);
  }

  async all(): Promise<Quest[]> {
    return await this.questRepository.findAll();
  }
}