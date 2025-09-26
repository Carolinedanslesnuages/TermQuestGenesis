import axios from 'axios';
import type { Quest, CreateQuestRequest } from '@domain/quests/quest.model';
import { QuestStatus } from '@domain/quests/quest.model';

const API_BASE_URL = 'http://localhost:3000';

export class QuestApi {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getAll(): Promise<Quest[]> {
    const response = await this.axiosInstance.get<Quest[]>('/quests');
    return response.data;
  }

  async getById(id: string): Promise<Quest> {
    const response = await this.axiosInstance.get<Quest>(`/quests/${id}`);
    return response.data;
  }

  async getByStatus(status: QuestStatus): Promise<Quest[]> {
    const response = await this.axiosInstance.get<Quest[]>(`/quests?status=${status}`);
    return response.data;
  }

  async getByUserId(userId: string): Promise<Quest[]> {
    const response = await this.axiosInstance.get<Quest[]>(`/quests/user/${userId}`);
    return response.data;
  }

  async create(quest: CreateQuestRequest): Promise<Quest> {
    const response = await this.axiosInstance.post<Quest>('/quests', quest);
    return response.data;
  }
}