import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { JobsModule } from './jobs/jobs.module';
import { CategoriesModule } from './categories/categories.module';
import { ContactModule } from './contact/contact.module';
import { AuditModule } from './audit/audit.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MenuModule } from './menu/menu.module';
import { UploadModule } from './upload/upload.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PostsModule,
    JobsModule,
    CategoriesModule,
    ContactModule,
    AuditModule,
    AnalyticsModule,
    MenuModule,
    UploadModule,
  ],
})
export class AppModule {}
