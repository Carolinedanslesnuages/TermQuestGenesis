import { apiClient } from "@infrastructure/apiClient";
import axios from "axios";
import type { User, CreateUserData, UpdateUserData } from "@domain/users/user";

/**
 * Base URL for user API endpoints
 */
const USER_API_BASE = "/users";

/**
 * User API client
 * Provides functions to communicate with the backend API for users
 */
export class UserApi {
  /**
   * Get all users
   * @returns Promise that resolves to an array of all users
   */
  static async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(USER_API_BASE);
    return response.data;
  }

  /**
   * Get user by ID
   * @param id - The user ID
   * @returns Promise that resolves to the user or null if not found
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(`${USER_API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a new user
   * @param userData - The user data to create
   * @returns Promise that resolves to the created user
   */
  static async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>(USER_API_BASE, userData);
    return response.data;
  }

  /**
   * Update an existing user
   * @param id - The user ID to update
   * @param userData - Partial user data to update
   * @returns Promise that resolves to the updated user
   */
  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await apiClient.put<User>(`${USER_API_BASE}/${id}`, userData);
    return response.data;
  }

  /**
   * Delete a user by ID
   * @param id - The user ID to delete
   * @returns Promise that resolves when the user is deleted
   */
  static async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`${USER_API_BASE}/${id}`);
  }
}
