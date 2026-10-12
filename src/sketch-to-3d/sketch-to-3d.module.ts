import { Module } from '@nestjs/common';
import { GenerationModule } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { SketchTo3dController } from './sketch-to-3d.controller';
import { SketchTo3dService } from './sketch-to-3d.service';

@Module({ imports: [GenerationModule], controllers: [SketchTo3dController], providers: [SketchTo3dService, GenerationJobService] })
export class SketchTo3dModule {}