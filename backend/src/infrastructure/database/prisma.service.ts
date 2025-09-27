import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma service providing database client
 * Handles connection lifecycle and provides singleton access to Prisma client
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // Configure logging based on environment
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });
  }

  /**
   * Connect to database when module initializes
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect from database when module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}