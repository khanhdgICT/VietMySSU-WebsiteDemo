import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findAll(type?: CategoryType) {
    const where: any = { isActive: true };
    if (type) where.type = type;
    return this.categoriesRepository.find({
      where,
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: string) {
    const cat = await this.categoriesRepository.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  create(dto: Partial<Category>) {
    const cat = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(cat);
  }

  async update(id: string, dto: Partial<Category>) {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.categoriesRepository.save(cat);
  }

  async remove(id: string) {
    const cat = await this.findOne(id);
    await this.categoriesRepository.remove(cat);
    return { message: 'Category deleted' };
  }
}
