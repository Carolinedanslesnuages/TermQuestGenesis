import axios from 'axios';
import type { User, CreateUserRequest } from '@domain/users/user.model';

const API_BASE_URL = 'http://localhost:3000';

export class UserApi {
  private axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getAll(): Promise<User[]> {
    const response = await this.axiosInstance.get<User[]>('/users');
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await this.axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }

  async create(user: CreateUserRequest): Promise<User> {
    const response = await this.axiosInstance.post<User>('/users', user);
    return response.data;
  }
}