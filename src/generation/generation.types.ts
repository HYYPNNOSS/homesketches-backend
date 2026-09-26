export type GenerationStatus = 'pending' | 'processing' | 'done' | 'failed';
export type GenerationKind = 'video' | '3d' | 'floor-plan' | 'walkthrough';

export interface GenerationResult {
  jobId: string;
  kind: GenerationKind;
  status: GenerationStatus;
  progress: number;
  resultUrl?: string;
  resultType?: 'video' | 'model' | 'image' | 'walkthrough';
  error?: string;
}

export interface GenerationProvider {
  createVideo(input: { file: Express.Multer.File; prompt?: string }): Promise<GenerationResult>;
  createModel(input: { file: Express.Multer.File; prompt?: string }): Promise<GenerationResult>;
  createFloorPlan(input: { file: Express.Multer.File; prompt?: string }): Promise<GenerationResult>;
  createWalkthrough(input: { files: Express.Multer.File[]; prompt?: string }): Promise<GenerationResult>;
}