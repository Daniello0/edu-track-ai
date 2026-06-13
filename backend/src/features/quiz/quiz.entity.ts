import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from '../material/material.entity';
import { QuizAttempt } from '../quiz-attempt/quiz-attempt.entity';
import { QuizQuestion } from './quiz.types';

/** Generated quiz attached to a single material. */
@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'material_id', type: 'uuid', unique: true })
  materialId!: string;

  @OneToOne(() => Material, (material) => material.quiz, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'material_id' })
  material!: Material;

  @Column({ type: 'jsonb' })
  questions!: QuizQuestion[];

  @Column({ name: 'best_score', type: 'integer', default: 0 })
  bestScore!: number;

  @OneToMany(() => QuizAttempt, (attempt) => attempt.quiz)
  attempts!: QuizAttempt[];
}
