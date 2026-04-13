import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService, CreateContactDto } from './contact.service';
import { SubmissionStatus } from './entities/contact-submission.entity';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactPublicController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  submit(@Body() dto: CreateContactDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    return this.contactService.create(dto, ip);
  }
}

@ApiTags('Contact (Admin)')
@Controller('admin/contact')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth()
export class ContactAdminController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @Permissions('contact:read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: SubmissionStatus,
  ) {
    return this.contactService.findAll({ page, limit, status });
  }

  @Get('stats')
  @Permissions('contact:read')
  getStats() {
    return this.contactService.getStats();
  }

  @Get(':id')
  @Permissions('contact:read')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Put(':id/status')
  @Permissions('contact:update')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: SubmissionStatus,
    @Body('notes') notes?: string,
  ) {
    return this.contactService.updateStatus(id, status, notes);
  }

  @Delete(':id')
  @Permissions('contact:delete')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
