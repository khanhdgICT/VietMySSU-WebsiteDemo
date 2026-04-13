import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobApplication } from './entities/job-application.entity';
import { JobsService } from './jobs.service';
import { JobsPublicController, JobsAdminController } from './jobs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobApplication])],
  providers: [JobsService],
  controllers: [JobsPublicController, JobsAdminController],
  exports: [JobsService],
})
export class JobsModule {}
