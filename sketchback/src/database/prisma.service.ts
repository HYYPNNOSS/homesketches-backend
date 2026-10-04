import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL is missing. Copy .env.example to .env and add the PostgreSQL connection string.');
      return;
    }
    try {
      await this.$connect();
    } catch (e: any) {
      console.error('Failed to connect to the database, but continuing server startup.', e.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}