import { Inject, Injectable } from '@nestjs/common';
import { GENERATION_PROVIDER } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { GenerationProvider } from '../generation/generation.types';
import { TextToSketchDto } from './text-to-sketch.controller';

@Injectable()
export class TextToSketchService {
  constructor(
    @Inject(GENERATION_PROVIDER) private readonly provider: GenerationProvider,
    private readonly jobs: GenerationJobService,
  ) {}

  async generate(dto: TextToSketchDto) {
    return this.jobs.save(await this.provider.createSketch({ prompt: dto.prompt }));
  }
}
