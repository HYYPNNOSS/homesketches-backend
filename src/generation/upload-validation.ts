import { BadRequestException } from '@nestjs/common';
import { maxUploadSize } from './upload-options';

const accepted = /\.(jpg|jpeg|png|webp|pdf)$/i;

export function validateUploadedFiles(files: Express.Multer.File[], minimum = 1) {
  if (files.length < minimum) throw new BadRequestException(`Upload at least ${minimum} supported image or PDF file${minimum === 1 ? '' : 's'}`);
  if (files.some((file) => file.size > maxUploadSize || !accepted.test(file.originalname))) {
    throw new BadRequestException('Each upload must be a JPG, PNG, WEBP, or PDF file up to 20MB');
  }
}