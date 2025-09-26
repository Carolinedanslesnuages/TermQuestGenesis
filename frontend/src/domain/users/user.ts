/**
 * User domain model interface
 * Represents a user in the system with basic identification and metadata
 * This interface matches the backend User entity structure
 */
export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;

  /**
   * User's email address
   */
  email: string;

  /**
   * User's display name/username
   */
  username: string;

  /**
   * Timestamp when the user was created
   */
  createdAt: Date;

  /**
   * Timestamp when the user was last updated
   */
  updatedAt: Date;
}

/**
 * User creation data interface
 * Used when creating a new user (without timestamps)
 */
export interface CreateUserData {
  id: string;
  email: string;
  username: string;
}

/**
 * User update data interface
 * Used when updating an existing user
 */
export interface UpdateUserData {
  email?: string;
  username?: string;
}

/**
 * User badge interface
 * Represents achievements or milestones earned by the user
 */
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

/**
 * Player profile interface
 * Extended user information with gaming-related data
 */
export interface PlayerProfile {
  userId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalQuestsCompleted: number;
  activeQuestsCount: number;
  achievements: UserBadge[];
  avatar?: string;
  joinedAt: Date;
  lastActiveAt: Date;
}

/**
 * Player stats interface
 * Statistical information about player progress
 */
export interface PlayerStats {
  totalQuests: number;
  completedQuests: number;
  activeQuests: number;
  draftQuests: number;
  completionRate: number;
  averageTimeToComplete: number; // in hours
  longestStreak: number;
  currentStreak: number;
}
