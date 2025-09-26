export enum QuestStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export class Quest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: QuestStatus,
    public readonly createdById: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    title: string,
    description: string,
    createdById: string,
  ): Quest {
    const now = new Date();
    return new Quest(
      generateId(),
      title,
      description,
      QuestStatus.DRAFT,
      createdById,
      now,
      now,
    );
  }

  activate(): Quest {
    return new Quest(
      this.id,
      this.title,
      this.description,
      QuestStatus.ACTIVE,
      this.createdById,
      this.createdAt,
      new Date(),
    );
  }

  complete(): Quest {
    if (this.status !== QuestStatus.ACTIVE) {
      throw new Error('Only active quests can be completed');
    }
    return new Quest(
      this.id,
      this.title,
      this.description,
      QuestStatus.COMPLETED,
      this.createdById,
      this.createdAt,
      new Date(),
    );
  }
}

// Placeholder for ID generation - would be moved to infrastructure layer
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
