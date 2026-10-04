import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { MultiImageTo3dModule } from './multi-image-to-3d/multi-image-to-3d.module';
import { SketchTo3dModule } from './sketch-to-3d/sketch-to-3d.module';
import { SketchToPlanModule } from './sketch-to-plan/sketch-to-plan.module';
import { SketchToVideoModule } from './sketch-to-video/sketch-to-video.module';
import { TextToSketchModule } from './text-to-sketch/text-to-sketch.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    SketchToVideoModule,
    SketchTo3dModule,
    SketchToPlanModule,
    MultiImageTo3dModule,
    TextToSketchModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}