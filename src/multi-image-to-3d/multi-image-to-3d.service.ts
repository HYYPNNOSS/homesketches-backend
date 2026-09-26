import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { GENERATION_PROVIDER } from '../generation/generation.module';
import { GenerationJobService } from '../generation/generation-job.service';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { GenerationProvider } from '../generation/generation.types';

@Injectable()
export class MultiImageTo3dService {
  constructor(
    @InjectQueue('walkthrough-reconstruction') private readonly queue: Queue,
    @Inject(GENERATION_PROVIDER) private readonly provider: GenerationProvider,
    private readonly jobs: GenerationJobService,
  ) {}

  async enqueue(files: Express.Multer.File[], dto: GenerationPromptDto) {
    const pending = this.jobs.pending('walkthrough');
    await this.queue.add('reconstruct-home', { jobId: pending.jobId, fileNames: files.map((file) => file.originalname), prompt: dto.prompt });
    void this.completeLater(pending.jobId, files, dto);
    return pending;
  }

  get(jobId: string) { return this.jobs.find(jobId); }

  private async completeLater(jobId: string, files: Express.Multer.File[], dto: GenerationPromptDto) {
    this.jobs.update(jobId, { status: 'processing', progress: 35 });
    setTimeout(async () => {
      try {
        const result = await this.provider.createWalkthrough({ files, prompt: dto.prompt });
        this.jobs.update(jobId, { status: 'done', progress: 100, resultUrl: result.resultUrl, resultType: result.resultType });
      } catch (error) {
        this.jobs.update(jobId, { status: 'failed', progress: 0, error: error instanceof Error ? error.message : 'Reconstruction failed' });
      }
    }, 1800);
  }
}