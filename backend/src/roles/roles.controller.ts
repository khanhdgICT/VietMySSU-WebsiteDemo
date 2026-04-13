import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService, CreateRoleDto, UpdateRoleDto } from './roles.service';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Roles & Permissions')
@Controller('admin/roles')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles:read')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  @Permissions('roles:read')
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Get(':id')
  @Permissions('roles:read')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Permissions('roles:create')
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Put(':id')
  @Permissions('roles:update')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('roles:delete')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
