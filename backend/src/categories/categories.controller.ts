import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category, CategoryType } from './entities/category.entity';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@Query('type') type?: CategoryType) {
    return this.categoriesService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('categories:create')
  @ApiBearerAuth()
  create(@Body() dto: Partial<Category>) {
    return this.categoriesService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('categories:update')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<Category>) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('categories:delete')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
