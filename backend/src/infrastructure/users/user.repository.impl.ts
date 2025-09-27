import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/users/user.entity';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

/**
 * PostgreSQL implementation of UserRepository using TypeORM
 */
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(user: User): Promise<User> {
    const userEntity = this.userRepository.create(user);
    return await this.userRepository.save(userEntity);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
