import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus, JobType } from './entities/job.entity';
import { JobApplication, ApplicationStatus } from './entities/job-application.entity';
import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsDate } from 'class-validator';

export class CreateJobDto {
  @IsString() title: string;
  @IsOptional() @IsString() titleEn?: string;
  @IsString() slug: string;
  @IsString() location: string;
  @IsOptional() @IsString() salary?: string;
  @IsOptional() @IsEnum(JobType) jobType?: JobType;
  @IsString() description: string;
  @IsOptional() @IsString() descriptionEn?: string;
  @IsString() requirements: string;
  @IsOptional() @IsString() requirementsEn?: string;
  @IsOptional() @IsString() benefits?: string;
  @IsOptional() @IsString() benefitsEn?: string;
  @IsOptional() @IsEnum(JobStatus) status?: JobStatus;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() deadline?: Date;
  @IsOptional() @IsNumber() quantity?: number;
}

export class CreateJobApplicationDto {
  @IsString() fullName: string;
  @IsString() email: string;
  @IsString() phone: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() cvUrl?: string;
  @IsOptional() @IsString() coverLetter?: string;
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private applicationsRepository: Repository<JobApplication>,
  ) {}

  async findAll(query: {
    page?: number; limit?: number; status?: JobStatus;
    search?: string; featured?: boolean;
  }) {
    const { page = 1, limit = 10, status, search, featured } = query;

    const qb = this.jobsRepository
      .createQueryBuilder('job')
      .orderBy('job.createdAt', 'DESC');

    if (status) qb.andWhere('job.status = :status', { status });
    if (featured) qb.andWhere('job.isFeatured = true');
    if (search) {
      qb.andWhere('job.title ILIKE :search OR job.location ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const job = await this.jobsRepository.findOne({ where: { slug } });
    if (!job) throw new NotFoundException('Job not found');
    await this.jobsRepository.increment({ id: job.id }, 'viewCount', 1);
    return job;
  }

  async findOne(id: string) {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async create(dto: CreateJobDto) {
    const job = this.jobsRepository.create(dto);
    return this.jobsRepository.save(job);
  }

  async update(id: string, dto: Partial<CreateJobDto>) {
    const job = await this.findOne(id);
    Object.assign(job, dto);
    return this.jobsRepository.save(job);
  }

  async remove(id: string) {
    const job = await this.findOne(id);
    await this.jobsRepository.remove(job);
    return { message: 'Job deleted' };
  }

  // Applications
  async apply(jobId: string, dto: CreateJobApplicationDto) {
    const job = await this.findOne(jobId);
    const application = this.applicationsRepository.create({ ...dto, job });
    return this.applicationsRepository.save(application);
  }

  async findApplications(jobId?: string, page = 1, limit = 20) {
    const qb = this.applicationsRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.job', 'job')
      .orderBy('app.createdAt', 'DESC');

    if (jobId) qb.andWhere('app.job.id = :jobId', { jobId });

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    await this.applicationsRepository.update(id, { status });
    return { message: 'Application status updated' };
  }
}
