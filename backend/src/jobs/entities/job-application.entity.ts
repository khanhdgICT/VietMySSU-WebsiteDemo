import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Job } from './job.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEWED = 'interviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  cvUrl: string;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
