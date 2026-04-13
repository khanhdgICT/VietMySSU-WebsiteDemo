import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async findAll(page = 1, limit = 20, search?: string) {
    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .orderBy('user.createdAt', 'DESC');

    if (search) {
      qb.andWhere(
        'user.fullName ILIKE :search OR user.email ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already exists');

    const user = this.usersRepository.create(dto);

    if (dto.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { id: dto.roleId },
      });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
    }

    return this.usersRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { id: dto.roleId },
      });
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
    }

    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
