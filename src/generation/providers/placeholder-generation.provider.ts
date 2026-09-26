import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GenerationProvider, GenerationResult } from '../generation.types';

@Injectable()
export class PlaceholderGenerationProvider implements GenerationProvider {
  async createVideo() { return this.result('video', 'video', 'https://cdn.sketch-studio.dev/previews/sample-flythrough.mp4'); }
  async createModel() { return this.result('3d', 'model', 'https://cdn.sketch-studio.dev/previews/sample-home.glb'); }
  async createFloorPlan() { return this.result('floor-plan', 'image', 'https://cdn.sketch-studio.dev/previews/sample-floor-plan.png'); }
  async createWalkthrough() { return this.result('walkthrough', 'walkthrough', 'https://cdn.sketch-studio.dev/previews/sample-walkthrough.glb'); }

  private result(kind: GenerationResult['kind'], resultType: GenerationResult['resultType'], resultUrl: string): GenerationResult {
    return { jobId: randomUUID(), kind, resultType, resultUrl, status: 'done', progress: 100 };
  }
}