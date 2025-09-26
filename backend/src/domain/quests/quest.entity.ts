import { v4 as uuidv4 } from 'uuid';

export enum QuestStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export class Quest {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly status: QuestStatus;
  public readonly createdById: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    status: QuestStatus,
    createdById: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdById = createdById;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(title: string, description: string, createdById: string): Quest {
    const now = new Date();
    return new Quest(
      uuidv4(),
      title,
      description,
      QuestStatus.DRAFT,
      createdById,
      now,
      now,
    );
  }

  updateStatus(status: QuestStatus): Quest {
    return new Quest(
      this.id,
      this.title,
      this.description,
      status,
      this.createdById,
      this.createdAt,
      new Date(),
    );
  }

  update(title?: string, description?: string): Quest {
    return new Quest(
      this.id,
      title ?? this.title,
      description ?? this.description,
      this.status,
      this.createdById,
      this.createdAt,
      new Date(),
    );
  }
}