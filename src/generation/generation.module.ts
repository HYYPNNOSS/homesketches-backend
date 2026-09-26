import { Module } from '@nestjs/common';
import { PlaceholderGenerationProvider } from './providers/placeholder-generation.provider';

export const GENERATION_PROVIDER = 'GENERATION_PROVIDER';

@Module({
  providers: [
    PlaceholderGenerationProvider,
    { provide: GENERATION_PROVIDER, useExisting: PlaceholderGenerationProvider },
  ],
  exports: [GENERATION_PROVIDER],
})
export class GenerationModule {}