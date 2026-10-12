import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { imageUploadPipe } from '../generation/upload-options';
import { SketchToPlanService } from './sketch-to-plan.service';

@ApiTags('sketch-to-plan')
@Controller('sketch-to-plan')
export class SketchToPlanController {
  constructor(private readonly service: SketchToPlanService) {}
  @Post('generate')
  @ApiOperation({ summary: 'Turn one sketch into a structured floor plan image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, prompt: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  generate(@UploadedFile(imageUploadPipe) file: Express.Multer.File, @Body() dto: GenerationPromptDto) { return this.service.generate(file, dto); }
}