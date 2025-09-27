import { apiClient } from "@infrastructure/apiClient";
import axios from "axios";
import type {
  Quest,
  QuestStatus,
  CreateQuestData,
  UpdateQuestData,
  QuestFilters,
} from "@domain/quests/quest";

/**
 * Base URL for quest API endpoints
 */
const QUEST_API_BASE = "/quests";

/**
 * Quest API client
 * Provides functions to communicate with the backend API for quests
 */
export class QuestApi {
  /**
   * Get all quests or filter by status
   * @param filters - Optional filters to apply
   * @returns Promise that resolves to an array of quests
   */
  static async getAllQuests(filters?: QuestFilters): Promise<Quest[]> {
    const params = new URLSearchParams();
    if (filters?.status) {
      params.append("status", filters.status);
    }

    const url = params.toString()
      ? `${QUEST_API_BASE}?${params.toString()}`
      : QUEST_API_BASE;
    const response = await apiClient.get<Quest[]>(url);
    return response.data;
  }

  /**
   * Get quest by ID
   * @param id - The quest ID
   * @returns Promise that resolves to the quest or null if not found
   */
  static async getQuestById(id: string): Promise<Quest | null> {
    try {
      const response = await apiClient.get<Quest>(`${QUEST_API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get quests by status
   * @param status - The quest status to filter by
   * @returns Promise that resolves to an array of quests with the specified status
   */
  static async getQuestsByStatus(status: QuestStatus): Promise<Quest[]> {
    const response = await apiClient.get<Quest[]>(
      `${QUEST_API_BASE}?status=${status}`,
    );
    return response.data;
  }

  /**
   * Get quests by user ID
   * @param userId - The user ID who created the quests
   * @returns Promise that resolves to an array of quests created by the user
   */
  static async getQuestsByUserId(userId: string): Promise<Quest[]> {
    const response = await apiClient.get<Quest[]>(
      `${QUEST_API_BASE}/user/${userId}`,
    );
    return response.data;
  }

  /**
   * Create a new quest
   * @param questData - The quest data to create
   * @returns Promise that resolves to the created quest
   */
  static async createQuest(questData: CreateQuestData): Promise<Quest> {
    const response = await apiClient.post<Quest>(QUEST_API_BASE, questData);
    return response.data;
  }

  /**
   * Update an existing quest
   * @param id - The quest ID to update
   * @param questData - Partial quest data to update
   * @returns Promise that resolves to the updated quest
   */
  static async updateQuest(
    id: string,
    questData: UpdateQuestData,
  ): Promise<Quest> {
    const response = await apiClient.put<Quest>(
      `${QUEST_API_BASE}/${id}`,
      questData,
    );
    return response.data;
  }

  /**
   * Delete a quest by ID
   * @param id - The quest ID to delete
   * @returns Promise that resolves when the quest is deleted
   */
  static async deleteQuest(id: string): Promise<void> {
    await apiClient.delete(`${QUEST_API_BASE}/${id}`);
  }
}
