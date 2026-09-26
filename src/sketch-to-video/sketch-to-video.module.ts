import { Module } from '@nestjs/common';
import { GenerationModule } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { SketchToVideoController } from './sketch-to-video.controller';
import { SketchToVideoService } from './sketch-to-video.service';

@Module({ imports: [GenerationModule], controllers: [SketchToVideoController], providers: [SketchToVideoService, GenerationJobService] })
export class SketchToVideoModule {}