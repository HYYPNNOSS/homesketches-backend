import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HuggingFaceGenerationProvider } from './providers/huggingface-generation.provider';

export const GENERATION_PROVIDER = 'GENERATION_PROVIDER';

@Module({
  imports: [ConfigModule],
  providers: [
    HuggingFaceGenerationProvider,
    { provide: GENERATION_PROVIDER, useExisting: HuggingFaceGenerationProvider },
  ],
  exports: [GENERATION_PROVIDER],
})
export class GenerationModule {}