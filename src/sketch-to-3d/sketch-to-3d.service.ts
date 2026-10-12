import { Inject, Injectable } from '@nestjs/common';
import { GENERATION_PROVIDER } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { GenerationProvider } from '../generation/generation.types';

@Injectable()
export class SketchTo3dService {
  constructor(@Inject(GENERATION_PROVIDER) private readonly provider: GenerationProvider, private readonly jobs: GenerationJobService) {}
  async generate(file: Express.Multer.File, dto: GenerationPromptDto) { return this.jobs.save(await this.provider.createModel({ file, prompt: dto.prompt })); }
}