import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/users/user.controller';
import { QuestController } from './presentation/quests/quest.controller';
import { UserService } from './application/users/user.service';
import { QuestService } from './application/quests/quest.service';
import { UserRepositoryImpl } from './infrastructure/users/user.repository.impl';
import { QuestRepositoryImpl } from './infrastructure/quests/quest.repository.impl';
import { PrismaModule } from './infrastructure/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [AppController, UserController, QuestController],
  providers: [
    AppService,
    UserService,
    QuestService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'QuestRepository',
      useClass: QuestRepositoryImpl,
    },
  ],
})
export class AppModule {}
