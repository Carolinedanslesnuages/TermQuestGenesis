import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '../../domain/users/user.entity';
import { UserRepository } from '../../infrastructure/users/user.repository';

/**
 * User application service
 * Provides application layer logic for user operations
 */
@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  /**
   * Find a user by ID
   * @param id - The user ID
   * @returns Promise that resolves to the user or null if not found
   */
  async findById(id: string): Promise<User | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid user ID provided');
    }
    return await this.userRepository.findById(id);
  }

  /**
   * Find all users
   * @returns Promise that resolves to an array of all users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  /**
   * Create a new user
   * @param user - The user to create
   * @returns Promise that resolves to the created user
   */
  async create(user: User): Promise<User> {
    if (!user.email || !user.username) {
      throw new Error('Email and username are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw new Error('Invalid email format');
    }

    try {
      return await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate')) {
        throw new ConflictException('User with this email or username already exists');
      }
      throw error;
    }
  }

  /**
   * Update an existing user
   * @param id - The user ID to update
   * @param user - Partial user data to update
   * @returns Promise that resolves to the updated user
   */
  async update(id: string, user: Partial<User>): Promise<User> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid user ID provided');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        throw new Error('Invalid email format');
      }
    }

    try {
      return await this.userRepository.update(id, user);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate')) {
        throw new ConflictException('User with this email or username already exists');
      }
      throw error;
    }
  }

  /**
   * Delete a user by ID
   * @param id - The user ID to delete
   * @returns Promise that resolves when the user is deleted
   */
  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid user ID provided');
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.delete(id);
  }
}
