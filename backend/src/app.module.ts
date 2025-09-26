import { Module } from '@nestjs/common';
import { UsersController } from '@presentation/users/users.controller';
import { QuestsController } from '@presentation/quests/quests.controller';
import { CreateUserService } from '@application/users/create-user.service';
import { GetUserService } from '@application/users/get-user.service';
import { CreateQuestService } from '@application/quests/create-quest.service';
import { GetQuestService } from '@application/quests/get-quest.service';
import { UserRepository } from '@infrastructure/users/user.repository';
import { QuestRepository } from '@infrastructure/quests/quest.repository';

// Create tokens for the interfaces
const USER_REPOSITORY_TOKEN = 'IUserRepository';
const QUEST_REPOSITORY_TOKEN = 'IQuestRepository';

@Module({
  controllers: [UsersController, QuestsController],
  providers: [
    // Application Services
    CreateUserService,
    GetUserService,
    CreateQuestService,
    GetQuestService,
    // Repository implementations
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
    {
      provide: QUEST_REPOSITORY_TOKEN,
      useClass: QuestRepository,
    },
  ],
})
export class AppModule {}