import { Module } from '@nestjs/common';
import { UsersController } from '@presentation/users/users.controller';
import { QuestsController } from '@presentation/quests/quests.controller';
import { CreateUserService } from '@application/users/create-user.service';
import { GetUserService } from '@application/users/get-user.service';
import { CreateQuestService } from '@application/quests/create-quest.service';
import { GetQuestService } from '@application/quests/get-quest.service';
import { UserRepository } from '@infrastructure/users/user.repository';
import { QuestRepository } from '@infrastructure/quests/quest.repository';
import { IUserRepository } from '@domain/users/user.repository.interface';
import { IQuestRepository } from '@domain/quests/quest.repository.interface';

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
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IQuestRepository,
      useClass: QuestRepository,
    },
  ],
})
export class AppModule {}