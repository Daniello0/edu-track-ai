import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import { MaterialStatus } from '../../common/enums/material-status.enum';
import { SummaryLength } from '../../common/enums/summary-length.enum';
import { Quiz } from '../quiz/quiz.entity';
import { User } from '../user/user.entity';

/** Saved learning material for an authenticated user. */
@Entity('materials')
@Unique(['userId', 'settingsHash'])
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.materials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'video_id', type: 'varchar', length: 50 })
  videoId!: string;

  @Column({ name: 'settings_hash', type: 'varchar', length: 64 })
  settingsHash!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    type: 'enum',
    enum: MaterialCategory,
    enumName: 'material_category',
  })
  category!: MaterialCategory;

  @Column({
    type: 'enum',
    enum: MaterialFormat,
    enumName: 'material_format',
  })
  format!: MaterialFormat;

  @Column({
    name: 'summary_length',
    type: 'enum',
    enum: SummaryLength,
    enumName: 'summary_length',
    nullable: true,
  })
  summaryLength!: SummaryLength | null;

  @Column({ type: 'varchar', length: 10 })
  language!: string;

  @Column({
    type: 'enum',
    enum: MaterialStatus,
    enumName: 'material_status',
    default: MaterialStatus.READ,
  })
  status!: MaterialStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({
    name: 'last_viewed_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  lastViewedAt!: Date;

  @OneToOne(() => Quiz, (quiz) => quiz.material)
  quiz!: Quiz;
}
