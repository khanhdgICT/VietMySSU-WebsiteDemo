import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService, CreateJobDto, CreateJobApplicationDto } from './jobs.service';
import { JobStatus } from './entities/job.entity';
import { ApplicationStatus } from './entities/job-application.entity';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Jobs (Public)')
@Controller('jobs')
export class JobsPublicController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('featured') featured?: boolean,
  ) {
    return this.jobsService.findAll({ page, limit, status: JobStatus.OPEN, search, featured });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.jobsService.findBySlug(slug);
  }

  @Post(':id/apply')
  apply(@Param('id') id: string, @Body() dto: CreateJobApplicationDto) {
    return this.jobsService.apply(id, dto);
  }
}

@ApiTags('Jobs (Admin)')
@Controller('admin/jobs')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth()
export class JobsAdminController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @Permissions('jobs:read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: JobStatus,
    @Query('search') search?: string,
  ) {
    return this.jobsService.findAll({ page, limit, status, search });
  }

  @Get('applications')
  @Permissions('jobs:read')
  findApplications(
    @Query('jobId') jobId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.jobsService.findApplications(jobId, page, limit);
  }

  @Get(':id')
  @Permissions('jobs:read')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Post()
  @Permissions('jobs:create')
  create(@Body() dto: CreateJobDto) {
    return this.jobsService.create(dto);
  }

  @Put(':id')
  @Permissions('jobs:update')
  update(@Param('id') id: string, @Body() dto: Partial<CreateJobDto>) {
    return this.jobsService.update(id, dto);
  }

  @Put('applications/:id/status')
  @Permissions('jobs:update')
  updateApplicationStatus(
    @Param('id') id: string,
    @Body('status') status: ApplicationStatus,
  ) {
    return this.jobsService.updateApplicationStatus(id, status);
  }

  @Delete(':id')
  @Permissions('jobs:delete')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
