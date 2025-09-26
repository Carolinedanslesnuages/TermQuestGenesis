import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';
import { QuestRepository } from './quest.repository';
import { QuestEntity } from './quest.entity';

/**
 * PostgreSQL implementation of QuestRepository using TypeORM
 */
@Injectable()
export class QuestRepositoryImpl implements QuestRepository {
  constructor(
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
  ) {}

  async findById(id: string): Promise<Quest | null> {
    const quest = await this.questRepository.findOne({ 
      where: { id },
      relations: ['createdBy']
    });
    return quest || null;
  }

  async findAll(): Promise<Quest[]> {
    return await this.questRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['createdBy']
    });
  }

  async findByStatus(status: QuestStatus): Promise<Quest[]> {
    return await this.questRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
      relations: ['createdBy']
    });
  }

  async findByUserId(userId: string): Promise<Quest[]> {
    return await this.questRepository.find({
      where: { createdById: userId },
      order: { createdAt: 'DESC' },
      relations: ['createdBy']
    });
  }

  async create(quest: Quest): Promise<Quest> {
    const questEntity = this.questRepository.create(quest);
    return await this.questRepository.save(questEntity);
  }

  async update(id: string, quest: Partial<Quest>): Promise<Quest> {
    await this.questRepository.update(id, quest);
    const updatedQuest = await this.questRepository.findOne({ 
      where: { id },
      relations: ['createdBy']
    });
    if (!updatedQuest) {
      throw new Error(`Quest with id ${id} not found`);
    }
    return updatedQuest;
  }

  async delete(id: string): Promise<void> {
    await this.questRepository.delete(id);
  }
}