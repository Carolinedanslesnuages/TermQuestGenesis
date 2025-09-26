import { Injectable, Inject } from '@nestjs/common';
import { User } from '@domain/users/user.entity';
import { IUserRepository } from '@domain/users/user.repository.interface';

@Injectable()
export class GetUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async byId(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async byEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async byUsername(username: string): Promise<User | null> {
    return await this.userRepository.findByUsername(username);
  }

  async all(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
