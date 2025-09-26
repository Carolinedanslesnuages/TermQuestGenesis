import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './presentation/users/user.controller';
import { QuestController } from './presentation/quests/quest.controller';
import { UserService } from './application/users/user.service';
import { QuestService } from './application/quests/quest.service';
import { UserRepositoryImpl } from './infrastructure/users/user.repository.impl';
import { QuestRepositoryImpl } from './infrastructure/quests/quest.repository.impl';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserEntity } from './infrastructure/users/user.entity';
import { QuestEntity } from './infrastructure/quests/quest.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, QuestEntity]),
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
