import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmConfig } from './database.config';
import { Material } from '../material/material.entity';
import { QuizAttempt } from '../quiz-attempt/quiz-attempt.entity';
import { Quiz } from '../quiz/quiz.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([RefreshToken, Material, Quiz, QuizAttempt]),
    UserModule,
  ],
  exports: [TypeOrmModule, UserModule],
})
export class DatabaseModule {}
