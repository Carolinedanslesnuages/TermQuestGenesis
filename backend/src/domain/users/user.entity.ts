/**
 * User domain entity
 * Represents a user in the system with basic identification and metadata
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
 * User entity class implementation
 */
export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Creates a new User entity with generated timestamps
   */
  static create(id: string, email: string, username: string): UserEntity {
    const now = new Date();
    return new UserEntity(id, email, username, now, now);
  }

  /**
   * Updates the user entity with new updatedAt timestamp
   */
  update(email?: string, username?: string): UserEntity {
    return new UserEntity(
      this.id,
      email ?? this.email,
      username ?? this.username,
      this.createdAt,
      new Date(),
    );
  }
}
