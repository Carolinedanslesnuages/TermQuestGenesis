import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';
import { UserEntity } from '../users/user.entity';

/**
 * TypeORM Quest entity for database persistence
 * Maps the domain Quest interface to database table structure
 */
@Entity('quests')
export class QuestEntity implements Quest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'completed', 'archived'],
    default: 'draft',
  })
  status: QuestStatus;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
