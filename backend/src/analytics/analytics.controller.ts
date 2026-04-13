import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('admin/analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('contact-chart')
  getContactChart(@Query('days') days?: number) {
    return this.analyticsService.getContactChart(days);
  }

  @Get('post-views-chart')
  getPostViewsChart(@Query('days') days?: number) {
    return this.analyticsService.getPostViewsChart(days);
  }

  @Get('recent-activity')
  getRecentActivity(@Query('limit') limit?: number) {
    return this.analyticsService.getRecentActivity(limit);
  }
}
