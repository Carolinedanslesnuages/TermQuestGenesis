import { DataSource } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { QuestEntity } from '../quests/quest.entity';

/**
 * TypeORM DataSource configuration for migrations
 * This is used by TypeORM CLI for running migrations
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'termquestgenesis',
  entities: [UserEntity, QuestEntity],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
