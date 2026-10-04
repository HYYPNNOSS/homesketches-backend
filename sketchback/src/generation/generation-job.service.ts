import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GenerationResult } from './generation.types';

@Injectable()
export class GenerationJobService {
  private readonly jobs = new Map<string, GenerationResult>();

  save(result: GenerationResult) { this.jobs.set(result.jobId, result); return result; }
  find(jobId: string) { return this.jobs.get(jobId); }
  pending(kind: GenerationResult['kind']): GenerationResult { const result = { jobId: randomUUID(), kind, status: 'pending' as const, progress: 0 }; this.save(result); return result; }
  update(jobId: string, update: Partial<GenerationResult>) { const current = this.jobs.get(jobId); if (!current) return undefined; const next = { ...current, ...update }; this.jobs.set(jobId, next); return next; }
}