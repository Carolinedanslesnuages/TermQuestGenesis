import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  CreateQuestService,
  CreateQuestDto,
} from '@application/quests/create-quest.service';
import { GetQuestService } from '@application/quests/get-quest.service';
import { QuestStatus } from '@domain/quests/quest.entity';

@ApiTags('quests')
@Controller('quests')
export class QuestsController {
  constructor(
    private readonly createQuestService: CreateQuestService,
    private readonly getQuestService: GetQuestService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quest' })
  @ApiResponse({ status: 201, description: 'Quest created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createQuestDto: CreateQuestDto) {
    try {
      return await this.createQuestService.execute(createQuestDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all quests or filter by status' })
  @ApiQuery({ name: 'status', required: false, enum: QuestStatus })
  @ApiResponse({ status: 200, description: 'Quests retrieved successfully' })
  async findAll(@Query('status') status?: QuestStatus) {
    if (status) {
      return await this.getQuestService.byStatus(status);
    }
    return await this.getQuestService.all();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quest by ID' })
  @ApiResponse({ status: 200, description: 'Quest retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Quest not found' })
  async findOne(@Param('id') id: string) {
    const quest = await this.getQuestService.byId(id);
    if (!quest) {
      throw new HttpException('Quest not found', HttpStatus.NOT_FOUND);
    }
    return quest;
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get quests by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User quests retrieved successfully',
  })
  async findByUser(@Param('userId') userId: string) {
    return await this.getQuestService.byCreatedById(userId);
  }
}
