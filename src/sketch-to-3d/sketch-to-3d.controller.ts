import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { imageUploadPipe } from '../generation/upload-options';
import { SketchTo3dService } from './sketch-to-3d.service';

@ApiTags('sketch-to-3d')
@Controller('sketch-to-3d')
export class SketchTo3dController {
  constructor(private readonly service: SketchTo3dService) {}
  @Post('generate')
  @ApiOperation({ summary: 'Turn one sketch into a GLB model' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' }, prompt: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  generate(@UploadedFile(imageUploadPipe) file: Express.Multer.File, @Body() dto: GenerationPromptDto) { return this.service.generate(file, dto); }
}