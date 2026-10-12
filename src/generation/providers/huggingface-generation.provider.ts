import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { GenerationProvider, GenerationResult } from '../generation.types';

/**
 * Hugging Face Inference API provider — completely free tier.
 * Uses HF serverless inference endpoints (no billing required, just a free HF account).
 *
 * Free models used:
 *   - Image generation  → black-forest-labs/FLUX.1-schnell  (fast, free)
 *   - Video generation  → damo-vilab/text-to-video-ms-1.7b
 *   - Floor plan        → same image model with architectural prompt
 *   - Walkthrough       → composite view with FLUX.1-schnell
 */
@Injectable()
export class HuggingFaceGenerationProvider implements GenerationProvider {
  private readonly logger = new Logger(HuggingFaceGenerationProvider.name);
  private readonly apiKey: string;
  private readonly hfApiBase = 'https://api-inference.huggingface.co/models';

  /** Model IDs on HF Inference API */
  private readonly imageModel = 'black-forest-labs/FLUX.1-schnell';
  private readonly videoModel = 'damo-vilab/text-to-video-ms-1.7b';

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('HF_API_KEY', '');
    if (!this.apiKey) {
      this.logger.warn('HF_API_KEY is not set — generation calls will fail with 401. Get a free key at https://huggingface.co/settings/tokens');
    }
  }

  // ─── Video ────────────────────────────────────────────────────────────────

  async createVideo(input: { file: Express.Multer.File; prompt?: string }): Promise<GenerationResult> {
    const prompt = this.buildVideoPrompt(input.file, input.prompt);
    const blob = await this.callHfApi(this.videoModel, { inputs: prompt });
    const resultUrl = await this.blobToDataUrl(blob);
    return this.done('video', 'video', resultUrl);
  }

  // ─── 3-D Model (rendered as perspective image) ────────────────────────────

  async createModel(input: { file: Express.Multer.File; prompt?: string }): Promise<GenerationResult> {
    const prompt = this.build3dPrompt(input.file, input.prompt);
    const blob = await this.callHfApi(this.imageModel, { inputs: prompt });
    const resultUrl = await this.blobToDataUrl(blob);
    return this.done('3d', 'image', resultUrl);
  }

  // ─── Floor Plan ───────────────────────────────────────────────────────────

  async createFloorPlan(input: { file: Express.Multer.File; prompt?: string }): Promise<GenerationResult> {
    const prompt = this.buildFloorPlanPrompt(input.file, input.prompt);
    const blob = await this.callHfApi(this.imageModel, { inputs: prompt });
    const resultUrl = await this.blobToDataUrl(blob);
    return this.done('floor-plan', 'image', resultUrl);
  }

  // ─── Walkthrough (multi-view collage) ─────────────────────────────────────

  async createWalkthrough(input: { files: Express.Multer.File[]; prompt?: string }): Promise<GenerationResult> {
    const prompt = this.buildWalkthroughPrompt(input.files, input.prompt);
    const blob = await this.callHfApi(this.imageModel, { inputs: prompt });
    const resultUrl = await this.blobToDataUrl(blob);
    return this.done('walkthrough', 'image', resultUrl);
  }

  // ─── Text to Sketch ───────────────────────────────────────────────────────

  async createSketch(input: { prompt: string }): Promise<GenerationResult> {
    const prompt = this.buildSketchPrompt(input.prompt);
    const blob = await this.callHfApi(this.imageModel, { inputs: prompt });
    const resultUrl = await this.blobToDataUrl(blob);
    return this.done('sketch', 'image', resultUrl);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async callHfApi(model: string, payload: Record<string, unknown>): Promise<Blob> {
    const url = `${this.hfApiBase}/${model}`;
    this.logger.log(`POST ${url}`);

    let response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Wait-For-Model': 'true',
        },
        body: JSON.stringify(payload),
      });
    } catch (e: any) {
      this.logger.error(`HF API network error: ${e.message}`);
      throw new InternalServerErrorException(`Hugging Face network error: ${e.message}`);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText);
      this.logger.error(`HF API error ${response.status}: ${text}`);
      throw new InternalServerErrorException(`Hugging Face API Error (${response.status}): ${text}`);
    }

    return response.blob();
  }

  /** Convert a response Blob to a base-64 data URL so the frontend can render it immediately without an S3 bucket. */
  private async blobToDataUrl(blob: Blob): Promise<string> {
    const buffer = Buffer.from(await blob.arrayBuffer());
    const mime = blob.type || 'image/png';
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }

  private buildVideoPrompt(file: Express.Multer.File, userPrompt?: string): string {
    const base = userPrompt?.trim() || 'Slow cinematic camera flythrough of a modern interior living space';
    return `${base}. Architectural interior, high quality, realistic, cinematic lighting, smooth camera motion`;
  }

  private build3dPrompt(file: Express.Multer.File, userPrompt?: string): string {
    const base = userPrompt?.trim() || 'Modern architectural interior space';
    return `Isometric 3D perspective render of ${base}. Architectural visualization, clean lines, professional render, high detail, ambient occlusion, realistic materials`;
  }

  private buildFloorPlanPrompt(file: Express.Multer.File, userPrompt?: string): string {
    const base = userPrompt?.trim() || 'open-plan apartment with living room, kitchen, and bedroom';
    return `Top-down architectural floor plan of ${base}. Clean technical drawing, black lines on white background, labeled rooms, walls, doors and windows marked, professional blueprint style`;
  }

  private buildWalkthroughPrompt(files: Express.Multer.File[], userPrompt?: string): string {
    const count = files.length;
    const base = userPrompt?.trim() || 'modern residential interior';
    return `Panoramic interior walkthrough composite of ${base}, ${count} views combined, architectural visualization, high quality render, navigable home perspective`;
  }

  private buildSketchPrompt(userPrompt?: string): string {
    const base = userPrompt?.trim() || 'beautiful modern room';
    return `Pencil sketch of ${base}, architectural line drawing, rough concept sketch, interior design doodle, black and white, hand drawn style, minimal shading`;
  }

  private done(kind: GenerationResult['kind'], resultType: GenerationResult['resultType'], resultUrl: string): GenerationResult {
    return { jobId: randomUUID(), kind, resultType, resultUrl, status: 'done', progress: 100 };
  }
}
