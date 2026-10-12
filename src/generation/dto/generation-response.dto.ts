import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenerationStatus } from '../generation.types';

export class GenerationResponseDto {
  @ApiProperty() jobId!: string;
  @ApiProperty({ enum: ['video', '3d', 'floor-plan', 'walkthrough'] }) kind!: string;
  @ApiProperty({ enum: ['pending', 'processing', 'done', 'failed'] }) status!: GenerationStatus;
  @ApiProperty() progress!: number;
  @ApiPropertyOptional() resultUrl?: string;
  @ApiPropertyOptional({ enum: ['video', 'model', 'image', 'walkthrough'] }) resultType?: string;
  @ApiPropertyOptional() error?: string;
}