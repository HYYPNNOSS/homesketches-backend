import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GenerationPromptDto {
  @ApiPropertyOptional({ description: 'Design direction, camera movement, materials, or room context.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  prompt?: string;
}