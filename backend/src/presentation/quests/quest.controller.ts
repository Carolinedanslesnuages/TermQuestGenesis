import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { QuestService } from '../../application/quests/quest.service';
import { Quest, QuestStatus } from '../../domain/quests/quest.entity';

/**
 * Quest REST controller
 * Provides HTTP endpoints for quest operations following RESTful principles
 */
@ApiTags('quests')
@Controller('quests')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  /**
   * Get all quests or filter by status
   */
  @Get()
  @ApiOperation({
    summary: 'Get all quests',
    description:
      'Retrieve a list of all quests in the system, optionally filtered by status',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['draft', 'active', 'completed', 'archived'],
    description: 'Filter quests by status',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved quests' })
  async findAll(@Query('status') status?: QuestStatus): Promise<Quest[]> {
    try {
      if (status) {
        return await this.questService.findByStatus(status);
      }
      return await this.questService.findAll();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid quest status')) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException(
        'Failed to retrieve quests',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get quest by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get quest by ID',
    description: 'Retrieve a specific quest by its unique identifier',
  })
  @ApiParam({ name: 'id', description: 'Unique quest identifier' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved quest' })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async findById(@Param('id') id: string): Promise<Quest> {
    try {
      const quest = await this.questService.findById(id);
      if (!quest) {
        throw new NotFoundException('Quest not found');
      }
      return quest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Invalid quest ID')) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException(
        'Failed to retrieve quest',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get quests by user ID
   */
  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get quests by user',
    description: 'Retrieve all quests created by a specific user',
  })
  @ApiParam({ name: 'userId', description: 'Unique user identifier' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user quests',
  })
  async findByUserId(@Param('userId') userId: string): Promise<Quest[]> {
    try {
      return await this.questService.findByUserId(userId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid user ID')) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException(
        'Failed to retrieve user quests',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new quest
   */
  @Post()
  @ApiOperation({
    summary: 'Create new quest',
    description: 'Create a new quest in the system',
  })
  @ApiBody({
    description: 'Quest data',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Unique quest identifier' },
        title: { type: 'string', description: 'Quest title' },
        description: { type: 'string', description: 'Quest description' },
        status: {
          type: 'string',
          enum: ['draft', 'active', 'completed', 'archived'],
          description: 'Quest status',
        },
        createdById: {
          type: 'string',
          description: 'ID of the user who created this quest',
        },
      },
      required: ['id', 'title', 'description', 'createdById'],
    },
  })
  @ApiResponse({ status: 201, description: 'Quest successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid quest data' })
  async create(@Body() quest: Quest): Promise<Quest> {
    try {
      return await this.questService.create(quest);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Failed to create quest', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Update an existing quest
   */
  @Put(':id')
  @ApiOperation({
    summary: 'Update quest',
    description: 'Update an existing quest',
  })
  @ApiParam({ name: 'id', description: 'Unique quest identifier' })
  @ApiBody({
    description: 'Partial quest data',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Quest title' },
        description: { type: 'string', description: 'Quest description' },
        status: {
          type: 'string',
          enum: ['draft', 'active', 'completed', 'archived'],
          description: 'Quest status',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Quest successfully updated' })
  @ApiResponse({ status: 400, description: 'Invalid quest data' })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async update(@Param('id') id: string, @Body() quest: Partial<Quest>): Promise<Quest> {
    try {
      return await this.questService.update(id, quest);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Failed to update quest', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete a quest
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete quest',
    description: 'Delete an existing quest',
  })
  @ApiParam({ name: 'id', description: 'Unique quest identifier' })
  @ApiResponse({ status: 200, description: 'Quest successfully deleted' })
  @ApiResponse({ status: 400, description: 'Invalid quest ID' })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.questService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('Invalid quest ID')) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Failed to delete quest', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
