import { Injectable } from '@nestjs/common';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';
import { QuestRepository } from './quest.repository';
import { PrismaService } from '../database/prisma.service';

/**
 * PostgreSQL implementation of QuestRepository using Prisma
 */
@Injectable()
export class QuestRepositoryImpl implements QuestRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findById(id: string): Promise<Quest | null> {
    const quest = await this.prisma.quest.findUnique({ 
      where: { id },
      include: { createdBy: true }
    });
    return quest ? this.mapQuestWithCreatedBy(quest) : null;
  }

  async findAll(): Promise<Quest[]> {
    const quests = await this.prisma.quest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true }
    });
    return quests.map(quest => this.mapQuestWithCreatedBy(quest));
  }

  async findByStatus(status: QuestStatus): Promise<Quest[]> {
    const quests = await this.prisma.quest.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true }
    });
    return quests.map(quest => this.mapQuestWithCreatedBy(quest));
  }

  async findByUserId(userId: string): Promise<Quest[]> {
    const quests = await this.prisma.quest.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' },
      include: { createdBy: true }
    });
    return quests.map(quest => this.mapQuestWithCreatedBy(quest));
  }

  async create(quest: Quest): Promise<Quest> {
    const createdQuest = await this.prisma.quest.create({
      data: {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        status: quest.status,
        createdById: quest.createdById,
        createdAt: quest.createdAt,
        updatedAt: quest.updatedAt,
      },
      include: { createdBy: true }
    });
    return this.mapQuestWithCreatedBy(createdQuest);
  }

  async update(id: string, quest: Partial<Quest>): Promise<Quest> {
    const updatedQuest = await this.prisma.quest.update({
      where: { id },
      data: {
        ...(quest.title && { title: quest.title }),
        ...(quest.description && { description: quest.description }),
        ...(quest.status && { status: quest.status }),
        updatedAt: new Date(),
      },
      include: { createdBy: true }
    });
    return this.mapQuestWithCreatedBy(updatedQuest);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quest.delete({
      where: { id },
    });
  }

  /**
   * Maps Prisma quest result to domain Quest interface
   * Handles the createdBy relation properly
   */
  private mapQuestWithCreatedBy(questWithCreatedBy: any): Quest {
    return {
      id: questWithCreatedBy.id,
      title: questWithCreatedBy.title,
      description: questWithCreatedBy.description,
      status: questWithCreatedBy.status,
      createdById: questWithCreatedBy.createdById,
      createdAt: questWithCreatedBy.createdAt,
      updatedAt: questWithCreatedBy.updatedAt,
      // Note: The createdBy user object is included in Prisma result but not part of the domain Quest interface
    };
  }
}
