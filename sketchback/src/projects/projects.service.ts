import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GenerateProjectDto } from './dto/generate-project.dto';

export type ProjectStatus = 'processing' | 'ready';

export interface ProjectJob {
  id: string;
  name: string;
  mode: GenerateProjectDto['mode'];
  sourceFiles: string[];
  brief?: string;
  style?: string;
  status: ProjectStatus;
  progress: number;
  createdAt: string;
}

@Injectable()
export class ProjectsService {
  private readonly projects: ProjectJob[] = [];

  create(dto: GenerateProjectDto): ProjectJob {
    const project: ProjectJob = {
      id: randomUUID(),
      name: dto.name,
      mode: dto.mode,
      sourceFiles: dto.sourceFiles,
      brief: dto.brief,
      style: dto.style,
      status: 'processing',
      progress: 12,
      createdAt: new Date().toISOString(),
    };
    this.projects.unshift(project);

    setTimeout(() => {
      project.status = 'ready';
      project.progress = 100;
    }, 1800);

    return project;
  }

  list() {
    return this.projects;
  }
}