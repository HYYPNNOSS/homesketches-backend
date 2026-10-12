import { BadRequestException, ParseFilePipeBuilder } from '@nestjs/common';

export const maxUploadSize = 20 * 1024 * 1024;
export const imageUploadPipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: maxUploadSize })
  .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp|pdf)$/i })
  .build({ exceptionFactory: () => new BadRequestException('Upload a JPG, PNG, WEBP, or PDF file up to 20MB') });