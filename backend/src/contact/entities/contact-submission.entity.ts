import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum SubmissionStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived',
}

@Entity('contact_submissions')
export class ContactSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  branch: string; // Hanoi | HCM | Danang

  @Column({ nullable: true })
  ipAddress: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.NEW,
  })
  status: SubmissionStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn()
  createdAt: Date;
}
