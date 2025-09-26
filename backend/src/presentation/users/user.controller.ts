import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '../../application/users/user.service';
import { User } from '../../domain/users/user.entity';

/**
 * User REST controller
 * Provides HTTP endpoints for user operations following RESTful principles
 */
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users
   */
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users' })
  async findAll(): Promise<User[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get user by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Unique user identifier' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Invalid user ID')) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException(
        'Failed to retrieve user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new user
   */
  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user in the system',
  })
  @ApiBody({
    description: 'User data',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique user identifier' },
        email: { type: 'string', description: 'User email address' },
        username: { type: 'string', description: 'User display name' },
      },
      required: ['id', 'email', 'username'],
    },
  })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async create(@Body() user: User): Promise<User> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Update an existing user
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update an existing user',
  })
  @ApiParam({ name: 'id', description: 'Unique user identifier' })
  @ApiBody({
    description: 'Partial user data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: 'User email address' },
        username: { type: 'string', description: 'User display name' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid user data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async update(@Param('id') id: string, @Body() user: Partial<User>): Promise<User> {
    try {
      return await this.userService.update(id, user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a user
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete an existing user',
  })
  @ApiParam({ name: 'id', description: 'Unique user identifier' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Invalid user ID')) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
