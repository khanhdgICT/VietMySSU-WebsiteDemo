import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PostsService, CreatePostDto } from './posts.service';
import { PostStatus } from './entities/post.entity';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

// Public endpoints (no auth required)
@ApiTags('Posts (Public)')
@Controller('posts')
export class PostsPublicController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('lang') lang?: string,
  ) {
    return this.postsService.findAll({
      page, limit, status: PostStatus.PUBLISHED, categoryId, search, lang,
    });
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }
}

// Admin endpoints
@ApiTags('Posts (Admin)')
@Controller('admin/posts')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@ApiBearerAuth()
export class PostsAdminController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Permissions('posts:read')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: PostStatus,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.postsService.findAll({ page, limit, status, categoryId, search });
  }

  @Get(':id')
  @Permissions('posts:read')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @Permissions('posts:create')
  create(@Body() dto: CreatePostDto, @Req() req: any) {
    return this.postsService.create(dto, req.user.id);
  }

  @Put(':id')
  @Permissions('posts:update')
  update(@Param('id') id: string, @Body() dto: Partial<CreatePostDto>) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('posts:delete')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
