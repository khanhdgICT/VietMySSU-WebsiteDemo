import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { MenuItem, MenuLocation } from './entities/menu-item.entity';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  findByLocation(@Query('location') location: MenuLocation) {
    return this.menuService.findByLocation(location || MenuLocation.HEADER);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('menu:read')
  @ApiBearerAuth()
  findAll() {
    return this.menuService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('menu:create')
  @ApiBearerAuth()
  create(@Body() dto: Partial<MenuItem>) {
    return this.menuService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('menu:update')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: Partial<MenuItem>) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('menu:delete')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
