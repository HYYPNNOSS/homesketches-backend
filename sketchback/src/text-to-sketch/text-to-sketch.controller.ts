import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { TextToSketchService } from './text-to-sketch.service';

export class TextToSketchDto {
  @IsString()
  @IsNotEmpty()
  prompt!: string;
}

@ApiTags('text-to-sketch')
@Controller('text-to-sketch')
export class TextToSketchController {
  constructor(private readonly service: TextToSketchService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Turn text into a sketch' })
  @ApiBody({ type: TextToSketchDto })
  generate(@Body() dto: TextToSketchDto) {
    return this.service.generate(dto);
  }
}
