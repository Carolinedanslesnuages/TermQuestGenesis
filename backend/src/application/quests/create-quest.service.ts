import { Injectable } from '@nestjs/common';
import { Quest } from '@domain/quests/quest.entity';
import { IQuestRepository } from '@domain/quests/quest.repository.interface';
import { IUserRepository } from '@domain/users/user.repository.interface';

export interface CreateQuestDto {
  title: string;
  description: string;
  createdById: string;
}

@Injectable()
export class CreateQuestService {
  constructor(
    private readonly questRepository: IQuestRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateQuestDto): Promise<Quest> {
    // Verify user exists
    const user = await this.userRepository.findById(dto.createdById);
    if (!user) {
      throw new Error('User not found');
    }

    // Create new quest
    const quest = Quest.create(dto.title, dto.description, dto.createdById);
    return await this.questRepository.save(quest);
  }
}