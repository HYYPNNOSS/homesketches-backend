import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class UpdateProfileDto {
  @Transform(({ value }: { value: unknown }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @Matches(/\S/, { message: "Name must not be blank" })
  @MinLength(2)
  @MaxLength(80)
  name!: string;
}
