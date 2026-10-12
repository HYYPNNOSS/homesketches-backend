import { IsArray, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export const generationModes = ['video', '3d', 'floor-plan', 'walkthrough'] as const;
export type GenerationMode = (typeof generationModes)[number];

export class GenerateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsIn(generationModes)
  mode!: GenerationMode;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  brief?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  style?: string;

  @IsArray()
  @IsString({ each: true })
  sourceFiles!: string[];
}