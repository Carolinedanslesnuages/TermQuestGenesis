import { Injectable } from '@nestjs/common';
import { User } from '@domain/users/user.entity';
import { IUserRepository } from '@domain/users/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  // In-memory storage for demo purposes
  // In real application, this would use TypeORM entities and database
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((user) => user.username === username) || null;
  }

  async save(user: User): Promise<User> {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}