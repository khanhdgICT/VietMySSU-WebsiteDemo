import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import {
  IsString, IsOptional, IsEnum, IsBoolean, IsUUID,
} from 'class-validator';

export class CreatePostDto {
  @IsString() title: string;
  @IsOptional() @IsString() titleEn?: string;
  @IsString() slug: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() excerptEn?: string;
  @IsString() content: string;
  @IsOptional() @IsString() contentEn?: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsOptional() @IsEnum(PostStatus) status?: PostStatus;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsUUID() categoryId?: string;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDescription?: string;
  @IsOptional() @IsString() metaKeywords?: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(query: {
    page?: number; limit?: number; status?: PostStatus;
    categoryId?: string; search?: string; lang?: string;
  }) {
    const { page = 1, limit = 10, status, categoryId, search } = query;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.createdAt', 'DESC');

    if (status) qb.andWhere('post.status = :status', { status });
    if (categoryId) qb.andWhere('post.category.id = :categoryId', { categoryId });
    if (search) {
      qb.andWhere('post.title ILIKE :search OR post.excerpt ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    const post = await this.postsRepository.findOne({ where: { slug } });
    if (!post) throw new NotFoundException('Post not found');
    await this.postsRepository.increment({ id: post.id }, 'viewCount', 1);
    return post;
  }

  async findOne(id: string) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto, authorId: string) {
    const post = this.postsRepository.create(dto);
    if (dto.categoryId) {
      const cat = await this.categoriesRepository.findOne({ where: { id: dto.categoryId } });
      if (cat) post.category = cat;
    }
    post.author = { id: authorId } as any;
    if (dto.status === PostStatus.PUBLISHED) post.publishedAt = new Date();
    return this.postsRepository.save(post);
  }

  async update(id: string, dto: Partial<CreatePostDto>) {
    const post = await this.findOne(id);
    if (dto.categoryId) {
      const cat = await this.categoriesRepository.findOne({ where: { id: dto.categoryId } });
      if (cat) post.category = cat;
    }
    if (dto.status === PostStatus.PUBLISHED && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    Object.assign(post, dto);
    return this.postsRepository.save(post);
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
    return { message: 'Post deleted' };
  }
}
