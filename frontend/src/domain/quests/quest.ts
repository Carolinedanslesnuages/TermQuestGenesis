/**
 * Quest status enumeration
 * Represents the different states a quest can be in
 */
export type QuestStatus = "draft" | "active" | "completed" | "archived";

/**
 * Quest domain model interface
 * Represents a quest in the system with title, description, status and metadata
 * This interface matches the backend Quest entity structure
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
 * Quest creation data interface
 * Used when creating a new quest (without timestamps, default status is draft)
 */
export interface CreateQuestData {
  id: string;
  title: string;
  description: string;
  createdById: string;
  status?: QuestStatus;
}

/**
 * Quest update data interface
 * Used when updating an existing quest
 */
export interface UpdateQuestData {
  title?: string;
  description?: string;
  status?: QuestStatus;
}

/**
 * Quest filter options interface
 * Used when filtering quests
 */
export interface QuestFilters {
  status?: QuestStatus;
  createdById?: string;
}
