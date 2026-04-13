import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

interface LogParams {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldData?: any;
  newData?: any;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(params: LogParams): Promise<void> {
    const log = this.auditLogRepository.create(params);
    await this.auditLogRepository.save(log);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, limit = 20, userId, action, resource, startDate, endDate } = query;
    const qb = this.auditLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    if (userId) qb.andWhere('log.userId = :userId', { userId });
    if (action) qb.andWhere('log.action = :action', { action });
    if (resource) qb.andWhere('log.resource = :resource', { resource });
    if (startDate && endDate) {
      qb.andWhere('log.createdAt BETWEEN :start AND :end', {
        start: new Date(startDate),
        end: new Date(endDate),
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
