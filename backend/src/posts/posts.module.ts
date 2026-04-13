import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import { PostsService } from './posts.service';
import { PostsPublicController, PostsAdminController } from './posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category])],
  providers: [PostsService],
  controllers: [PostsPublicController, PostsAdminController],
  exports: [PostsService],
})
export class PostsModule {}
