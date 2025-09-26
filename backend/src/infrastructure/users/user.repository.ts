import { User } from '../../domain/users/user.entity';

/**
 * User repository contract
 * Defines the interface for user data access operations
 */
export interface UserRepository {
  /**
   * Find a user by ID
   * @param id - The user ID
   * @returns Promise that resolves to the user or null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find all users
   * @returns Promise that resolves to an array of all users
   */
  findAll(): Promise<User[]>;

  /**
   * Create a new user
   * @param user - The user to create
   * @returns Promise that resolves to the created user
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user
   * @param id - The user ID to update
   * @param user - Partial user data to update
   * @returns Promise that resolves to the updated user
   */
  update(id: string, user: Partial<User>): Promise<User>;

  /**
   * Delete a user by ID
   * @param id - The user ID to delete
   * @returns Promise that resolves when the user is deleted
   */
  delete(id: string): Promise<void>;
}
