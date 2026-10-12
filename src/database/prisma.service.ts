import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // Mirror the pool settings from the connection URL so Prisma respects them
      // even in environments where URL query params are stripped.
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
      log: [
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ],
    });
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL is missing. Add the MySQL connection string to .env.');
      return;
    }
    try {
      await this.$connect();
      console.log('Database connection established.');
    } catch (e: any) {
      console.error('Failed to connect to the database, but continuing server startup.', e.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}