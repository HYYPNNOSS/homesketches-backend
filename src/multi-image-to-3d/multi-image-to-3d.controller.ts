import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GenerationPromptDto } from '../generation/dto/generation-prompt.dto';
import { validateUploadedFiles } from '../generation/upload-validation';
import { MultiImageTo3dService } from './multi-image-to-3d.service';

@ApiTags('multi-image-to-3d')
@Controller('multi-image-to-3d')
export class MultiImageTo3dController {
  constructor(private readonly service: MultiImageTo3dService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Queue multiple images for a navigable home reconstruction' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['files'], properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } }, prompt: { type: 'string' } } } })
  @UseInterceptors(FilesInterceptor('files', 12))
  generate(@UploadedFiles() files: Express.Multer.File[], @Body() dto: GenerationPromptDto) { validateUploadedFiles(files, 2); return this.service.enqueue(files, dto); }

  @Get(':jobId')
  @ApiOperation({ summary: 'Poll a navigable home reconstruction job' })
  @ApiParam({ name: 'jobId' })
  status(@Param('jobId') jobId: string) { return this.service.get(jobId); }
}