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
