import { Module } from '@nestjs/common';
import { GenerationModule } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { TextToSketchController } from './text-to-sketch.controller';
import { TextToSketchService } from './text-to-sketch.service';

@Module({
  imports: [GenerationModule],
  controllers: [TextToSketchController],
  providers: [TextToSketchService, GenerationJobService],
})
export class TextToSketchModule {}
