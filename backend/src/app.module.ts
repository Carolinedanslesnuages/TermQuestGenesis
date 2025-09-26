import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/users/user.controller';
import { QuestController } from './presentation/quests/quest.controller';
import { UserService } from './application/users/user.service';
import { QuestService } from './application/quests/quest.service';
import { UserRepository } from './infrastructure/users/user.repository';
import { QuestRepository } from './infrastructure/quests/quest.repository';

// Mock repository implementations for controller stubs
const mockUserRepository: UserRepository = {
  findById: async () => null,
  findAll: async () => [],
  create: async (user) => user,
  update: async (id, user) => ({ ...user, id }) as any,
  delete: async () => undefined,
};

const mockQuestRepository: QuestRepository = {
  findById: async () => null,
  findAll: async () => [],
  findByStatus: async () => [],
  findByUserId: async () => [],
  create: async (quest) => quest,
  update: async (id, quest) => ({ ...quest, id }) as any,
  delete: async () => undefined,
};

@Module({
  imports: [],
  controllers: [AppController, UserController, QuestController],
  providers: [
    AppService,
    UserService,
    QuestService,
    {
      provide: 'UserRepository',
      useValue: mockUserRepository,
    },
    {
      provide: 'QuestRepository',
      useValue: mockQuestRepository,
    },
  ],
})
export class AppModule {}
