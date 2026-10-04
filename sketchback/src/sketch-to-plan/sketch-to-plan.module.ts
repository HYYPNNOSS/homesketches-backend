import { Module } from '@nestjs/common';
import { GenerationModule } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { SketchToPlanController } from './sketch-to-plan.controller';
import { SketchToPlanService } from './sketch-to-plan.service';

@Module({ imports: [GenerationModule], controllers: [SketchToPlanController], providers: [SketchToPlanService, GenerationJobService] })
export class SketchToPlanModule {}