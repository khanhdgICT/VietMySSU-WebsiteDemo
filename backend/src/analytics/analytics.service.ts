import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { Job } from '../jobs/entities/job.entity';
import { ContactSubmission } from '../contact/entities/contact-submission.entity';
import { User } from '../users/entities/user.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(ContactSubmission)
    private contactRepository: Repository<ContactSubmission>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async getDashboardStats() {
    const [totalPosts, totalJobs, totalUsers, totalContacts] = await Promise.all([
      this.postsRepository.count(),
      this.jobsRepository.count(),
      this.usersRepository.count(),
      this.contactRepository.count(),
    ]);

    const newContacts = await this.contactRepository.count({
      where: { status: 'new' as any },
    });

    const topPosts = await this.postsRepository.find({
      order: { viewCount: 'DESC' },
      take: 5,
      relations: ['category'],
    });

    return {
      stats: { totalPosts, totalJobs, totalUsers, totalContacts, newContacts },
      topPosts,
    };
  }

  async getContactChart(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await this.contactRepository
      .createQueryBuilder('c')
      .select("DATE_TRUNC('day', c.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('c.createdAt >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('day', c.createdAt)")
      .orderBy('date', 'ASC')
      .getRawMany();

    return results;
  }

  async getPostViewsChart(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.postsRepository
      .createQueryBuilder('p')
      .select("DATE_TRUNC('day', p.publishedAt)", 'date')
      .addSelect('SUM(p.viewCount)', 'views')
      .where('p.publishedAt >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('day', p.publishedAt)")
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getRecentActivity(limit = 10) {
    return this.auditRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }
}
