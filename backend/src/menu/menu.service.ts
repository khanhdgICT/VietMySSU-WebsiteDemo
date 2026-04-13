import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem, MenuLocation } from './entities/menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuItem)
    private menuRepository: Repository<MenuItem>,
  ) {}

  async findByLocation(location: MenuLocation) {
    const items = await this.menuRepository.find({
      where: { location, isActive: true, parent: null as any },
      relations: ['children', 'children.children'],
      order: { sortOrder: 'ASC' },
    });
    return items;
  }

  findAll() {
    return this.menuRepository.find({
      relations: ['parent', 'children'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: string) {
    const item = await this.menuRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: Partial<MenuItem>) {
    const item = this.menuRepository.create(dto);
    if (dto.parent?.id) {
      const parent = await this.findOne(dto.parent.id);
      item.parent = parent;
    }
    return this.menuRepository.save(item);
  }

  async update(id: string, dto: Partial<MenuItem>) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.menuRepository.save(item);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.menuRepository.remove(item);
    return { message: 'Menu item deleted' };
  }
}
