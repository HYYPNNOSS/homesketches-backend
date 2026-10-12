import { Module } from '@nestjs/common';
import { GenerationModule } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { MultiImageTo3dController } from './multi-image-to-3d.controller';
import { MultiImageTo3dService } from './multi-image-to-3d.service';

@Module({
  imports: [GenerationModule],
  controllers: [MultiImageTo3dController],
  providers: [MultiImageTo3dService, GenerationJobService],
})
export class MultiImageTo3dModule {}