import { Injectable } from '@nestjs/common';
import { User } from '../../domain/users/user.entity';
import { UserRepository } from './user.repository';
import { PrismaService } from '../database/prisma.service';

/**
 * PostgreSQL implementation of UserRepository using Prisma
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ 
      where: { id } 
    });
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: User): Promise<User> {
    return await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(user.email && { email: user.email }),
        ...(user.username && { username: user.username }),
        updatedAt: new Date(),
      },
    });
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
