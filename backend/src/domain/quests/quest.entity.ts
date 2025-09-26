/**
 * Quest status enumeration
 */
export type QuestStatus = 'draft' | 'active' | 'completed' | 'archived';

/**
 * Quest domain entity
 * Represents a quest in the system with title, description, status and metadata
 */
export interface Quest {
  /**
   * Unique identifier for the quest
   */
  id: string;

  /**
   * Quest title
   */
  title: string;

  /**
   * Quest description
   */
  description: string;

  /**
   * Current status of the quest
   */
  status: QuestStatus;

  /**
   * ID of the user who created this quest
   */
  createdById: string;

  /**
   * Timestamp when the quest was created
   */
  createdAt: Date;

  /**
   * Timestamp when the quest was last updated
   */
  updatedAt: Date;
}

/**
 * Quest entity class implementation
 */
export class QuestEntity implements Quest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: QuestStatus,
    public readonly createdById: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Creates a new Quest entity with default draft status and generated timestamps
   */
  static create(
    id: string,
    title: string,
    description: string,
    createdById: string,
  ): QuestEntity {
    const now = new Date();
    return new QuestEntity(
      id,
      title,
      description,
      'draft',
      createdById,
      now,
      now,
    );
  }

  /**
   * Updates the quest entity with new updatedAt timestamp
   */
  update(
    title?: string,
    description?: string,
    status?: QuestStatus,
  ): QuestEntity {
    return new QuestEntity(
      this.id,
      title ?? this.title,
      description ?? this.description,
      status ?? this.status,
      this.createdById,
      this.createdAt,
      new Date(),
    );
  }

  /**
   * Changes the quest status
   */
  changeStatus(status: QuestStatus): QuestEntity {
    return this.update(undefined, undefined, status);
  }
}
