import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission, SubmissionStatus } from './entities/contact-submission.entity';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsString() fullName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() company?: string;
  @IsString() subject: string;
  @IsString() message: string;
  @IsOptional() @IsString() branch?: string;
}

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactSubmission)
    private submissionsRepository: Repository<ContactSubmission>,
  ) {}

  async create(dto: CreateContactDto, ipAddress?: string) {
    const submission = this.submissionsRepository.create({ ...dto, ipAddress });
    return this.submissionsRepository.save(submission);
  }

  async findAll(query: {
    page?: number; limit?: number; status?: SubmissionStatus;
  }) {
    const { page = 1, limit = 20, status } = query;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await this.submissionsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const sub = await this.submissionsRepository.findOne({ where: { id } });
    if (!sub) throw new NotFoundException('Submission not found');
    if (sub.status === SubmissionStatus.NEW) {
      await this.submissionsRepository.update(id, { status: SubmissionStatus.READ });
    }
    return sub;
  }

  async updateStatus(id: string, status: SubmissionStatus, notes?: string) {
    await this.submissionsRepository.update(id, { status, adminNotes: notes });
    return { message: 'Status updated' };
  }

  async remove(id: string) {
    const sub = await this.findOne(id);
    await this.submissionsRepository.remove(sub);
    return { message: 'Deleted' };
  }

  async getStats() {
    const total = await this.submissionsRepository.count();
    const newCount = await this.submissionsRepository.count({
      where: { status: SubmissionStatus.NEW },
    });
    return { total, new: newCount };
  }
}
