import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  titleEn: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text', nullable: true })
  excerptEn: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  contentEn: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  publishedAt: Date;

  // SEO
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  metaKeywords: string;

  @ManyToOne(() => Category, (category) => category.posts, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
