import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { imageUploadPipe } from '../generation/upload-options';
import { SketchToVideoService } from './sketch-to-video.service';

@ApiTags('sketch-to-video')
@Controller('sketch-to-video')
export class SketchToVideoController {
  constructor(private readonly service: SketchToVideoService) {}
  @Post('generate')
  @ApiOperation({ summary: 'Turn one sketch into a cinematic video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, prompt: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  generate(@UploadedFile(imageUploadPipe) file: Express.Multer.File, @Body() dto: GenerationPromptDto) { return this.service.generate(file, dto); }
}