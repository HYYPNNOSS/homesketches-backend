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

  async generatePlan(dto: TextToSketchDto) {
    const prompt = dto.prompt.toLowerCase();
    const is2Bed = prompt.includes('2 bed') || prompt.includes('two bed');
    const isOffice = prompt.includes('office') || prompt.includes('workspace');

    if (isOffice) {
      return {
        unit: 'm',
        canvas: { widthM: 14, depthM: 10, gridStep: 0.1 },
        walls: [
          { id: 'w1', a: [0, 0], b: [14, 0] },
          { id: 'w2', a: [14, 0], b: [14, 10] },
          { id: 'w3', a: [14, 10], b: [0, 10] },
          { id: 'w4', a: [0, 10], b: [0, 0] },
          { id: 'w5', a: [7, 0], b: [7, 10] },
        ],
        rooms: [
          { id: 'r1', name: 'Open Office', x: 0, z: 0, w: 7, d: 10, materialId: 'polished-concrete' },
          { id: 'r2', name: 'Conference Room', x: 7, z: 0, w: 7, d: 10, materialId: 'cozy-carpet' },
        ],
        openings: [
          { id: 'o1', type: 'door', at: [3.5, 0], w: 1.0, wallId: 'w1' },
          { id: 'o2', type: 'door', at: [7, 5], w: 0.9, wallId: 'w5' },
          { id: 'o3', type: 'window', at: [14, 5], w: 2.0, wallId: 'w2' },
        ],
        items: [
          { id: 'i1', kind: 'table', x: 3.5, z: 4, rot: 0 },
          { id: 'i2', kind: 'chair', x: 3.5, z: 3.2, rot: 0 },
          { id: 'i3', kind: 'table', x: 10.5, z: 5, rot: 0 },
          { id: 'i4', kind: 'plant', x: 1, z: 1, rot: 0 },
        ],
      };
    }

    if (is2Bed) {
      return {
        unit: 'm',
        canvas: { widthM: 14, depthM: 10, gridStep: 0.1 },
        walls: [
          { id: 'w1', a: [0, 0], b: [14, 0] },
          { id: 'w2', a: [14, 0], b: [14, 10] },
          { id: 'w3', a: [14, 10], b: [0, 10] },
          { id: 'w4', a: [0, 10], b: [0, 0] },
          { id: 'w5', a: [7, 0], b: [7, 10] },
          { id: 'w6', a: [7, 5], b: [14, 5] },
        ],
        rooms: [
          { id: 'r1', name: 'Living & Kitchen', x: 0, z: 0, w: 7, d: 10, materialId: 'oak-wood' },
          { id: 'r2', name: 'Primary Bedroom', x: 7, z: 0, w: 7, d: 5, materialId: 'cozy-carpet' },
          { id: 'r3', name: 'Second Bedroom', x: 7, z: 5, w: 7, d: 5, materialId: 'oak-wood' },
        ],
        openings: [
          { id: 'o1', type: 'door', at: [3.5, 0], w: 0.9, wallId: 'w1' },
          { id: 'o2', type: 'door', at: [7, 2.5], w: 0.85, wallId: 'w5' },
          { id: 'o3', type: 'door', at: [7, 7.5], w: 0.85, wallId: 'w5' },
          { id: 'o4', type: 'window', at: [3.5, 10], w: 2.0, wallId: 'w3' },
          { id: 'o5', type: 'window', at: [14, 2.5], w: 1.5, wallId: 'w2' },
        ],
        items: [
          { id: 'i1', kind: 'sofa', x: 3.5, z: 7, rot: 0 },
          { id: 'i2', kind: 'tv', x: 3.5, z: 9.5, rot: 0 },
          { id: 'i3', kind: 'kitchen', x: 3.5, z: 1.5, rot: 0 },
          { id: 'i4', kind: 'bed', x: 10.5, z: 2.5, rot: 0 },
          { id: 'i5', kind: 'bed', x: 10.5, z: 7.5, rot: 0 },
          { id: 'i6', kind: 'plant', x: 0.8, z: 8.5, rot: 0 },
        ],
      };
    }

    // Default 1-Bed Modern Layout
    return {
      unit: 'm',
      canvas: { widthM: 10, depthM: 8, gridStep: 0.1 },
      walls: [
        { id: 'w1', a: [0, 0], b: [10, 0] },
        { id: 'w2', a: [10, 0], b: [10, 8] },
        { id: 'w3', a: [10, 8], b: [0, 8] },
        { id: 'w4', a: [0, 8], b: [0, 0] },
        { id: 'w5', a: [5, 0], b: [5, 8] },
      ],
      rooms: [
        { id: 'r1', name: 'Living Room', x: 0, z: 0, w: 5, d: 8, materialId: 'oak-wood' },
        { id: 'r2', name: 'Bedroom', x: 5, z: 0, w: 5, d: 8, materialId: 'cozy-carpet' },
      ],
      openings: [
        { id: 'o1', type: 'door', at: [2.5, 0], w: 0.9, wallId: 'w1' },
        { id: 'o2', type: 'door', at: [5, 4], w: 0.85, wallId: 'w5' },
        { id: 'o3', type: 'window', at: [2.5, 8], w: 1.6, wallId: 'w3' },
        { id: 'o4', type: 'window', at: [10, 4], w: 1.4, wallId: 'w2' },
      ],
      items: [
        { id: 'i1', kind: 'sofa', x: 2.5, z: 5, rot: 0 },
        { id: 'i2', kind: 'bed', x: 7.5, z: 4, rot: 0 },
        { id: 'i3', kind: 'wardrobe', x: 7.5, z: 1.5, rot: 0 },
        { id: 'i4', kind: 'plant', x: 0.8, z: 6.8, rot: 0 },
      ],
    };
  }
}
