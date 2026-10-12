import { Inject, Injectable, Logger } from '@nestjs/common';
import { GENERATION_PROVIDER } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { GenerationProvider } from '../generation/generation.types';

@Injectable()
export class MultiImageTo3dService {
  private readonly logger = new Logger(MultiImageTo3dService.name);

  constructor(
    @Inject(GENERATION_PROVIDER) private readonly provider: GenerationProvider,
    private readonly jobs: GenerationJobService,
  ) {}

  async enqueue(files: Express.Multer.File[], dto: GenerationPromptDto) {
    const pending = this.jobs.pending('walkthrough');
    // Fire-and-forget: run generation in background without blocking the HTTP response
    void this.processInBackground(pending.jobId, files, dto);
    return pending;
  }

  get(jobId: string) {
    return this.jobs.find(jobId);
  }

  private async processInBackground(jobId: string, files: Express.Multer.File[], dto: GenerationPromptDto) {
    this.jobs.update(jobId, { status: 'processing', progress: 20 });
    try {
      const result = await this.provider.createWalkthrough({ files, prompt: dto.prompt });
      this.jobs.update(jobId, {
        status: 'done',
        progress: 100,
        resultUrl: result.resultUrl,
        resultType: result.resultType,
      });
      this.logger.log(`Walkthrough job ${jobId} completed`);
    } catch (error) {
      this.logger.error(`Walkthrough job ${jobId} failed`, error);
      this.jobs.update(jobId, {
        status: 'failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Reconstruction failed',
      });
    }
  }
}