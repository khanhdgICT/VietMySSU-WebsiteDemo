import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../roles/entities/permission.entity';
import { Post } from '../posts/entities/post.entity';
import { Job } from '../jobs/entities/job.entity';
import { JobApplication } from '../jobs/entities/job-application.entity';
import { Category } from '../categories/entities/category.entity';
import { ContactSubmission } from '../contact/entities/contact-submission.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { MenuItem } from '../menu/entities/menu-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const entities = [
          User, Role, Permission, Post, Job, JobApplication,
          Category, ContactSubmission, AuditLog, MenuItem,
        ];
        const isProduction = configService.get<string>('nodeEnv') === 'production';
        const databaseUrl = process.env.DATABASE_URL;

        // Prefer DATABASE_URL when available (Neon, Render, Railway, etc.)
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities,
            synchronize: true,
            logging: false,
            ssl: { rejectUnauthorized: false },
          };
        }

        return {
          type: 'postgres' as const,
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.pass'),
          database: configService.get<string>('database.name'),
          entities,
          synchronize: configService.get<boolean>('database.sync'),
          logging: configService.get<boolean>('database.logging'),
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
