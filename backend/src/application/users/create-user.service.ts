import { Injectable, Inject } from '@nestjs/common';
import { User } from '@domain/users/user.entity';
import { IUserRepository } from '@domain/users/user.repository.interface';

export interface CreateUserDto {
  email: string;
  username: string;
}

@Injectable()
export class CreateUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(
      dto.email,
    );
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(
      dto.username,
    );
    if (existingUserByUsername) {
      throw new Error('User with this username already exists');
    }

    // Create new user
    const user = User.create(dto.email, dto.username);
    return await this.userRepository.save(user);
  }
}
