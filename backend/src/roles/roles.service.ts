import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() permissionIds?: string[];
}

export class UpdateRoleDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() permissionIds?: string[];
}

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  findAll() {
    return this.rolesRepository.find({ relations: ['permissions'] });
  }

  findAllPermissions() {
    return this.permissionsRepository.find({ order: { resource: 'ASC', action: 'ASC' } });
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(dto: CreateRoleDto) {
    const exists = await this.rolesRepository.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Role name already exists');

    const role = this.rolesRepository.create(dto);

    if (dto.permissionIds?.length) {
      role.permissions = await this.permissionsRepository.findByIds(dto.permissionIds);
    }

    return this.rolesRepository.save(role);
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, dto);

    if (dto.permissionIds !== undefined) {
      role.permissions = dto.permissionIds.length
        ? await this.permissionsRepository.findByIds(dto.permissionIds)
        : [];
    }

    return this.rolesRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.findOne(id);
    await this.rolesRepository.remove(role);
    return { message: 'Role deleted' };
  }
}
