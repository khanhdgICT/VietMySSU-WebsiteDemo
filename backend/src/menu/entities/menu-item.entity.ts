import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum MenuLocation {
  HEADER = 'header',
  FOOTER = 'footer',
}

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  labelEn: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'enum', enum: MenuLocation, default: MenuLocation.HEADER })
  location: MenuLocation;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  openInNewTab: boolean;

  // Self-referencing for nested menus
  @ManyToOne(() => MenuItem, (item) => item.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: MenuItem;

  @OneToMany(() => MenuItem, (item) => item.parent)
  children: MenuItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
