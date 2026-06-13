import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Material } from '../material/material.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';

/** Registered user linked to Firebase Authentication. */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'firebase_uid', type: 'varchar', length: 128, unique: true })
  firebaseUid!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => Material, (material) => material.user)
  materials!: Material[];
}
