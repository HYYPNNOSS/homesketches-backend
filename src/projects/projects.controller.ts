import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenerateProjectDto } from './dto/generate-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list() {
    return this.projectsService.list();
  }

  @Post('generate')
  generate(@Body() dto: GenerateProjectDto) {
    return this.projectsService.create(dto);
  }
}