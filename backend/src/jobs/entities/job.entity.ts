import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { JobApplication } from './job-application.entity';

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DRAFT = 'draft',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  titleEn: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ type: 'enum', enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ type: 'text' })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  requirementsEn: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ type: 'text', nullable: true })
  benefitsEn: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status: JobStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  viewCount: number;

  @OneToMany(() => JobApplication, (app) => app.job)
  applications: JobApplication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
