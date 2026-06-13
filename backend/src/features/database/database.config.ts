import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DB_HOST_ENV,
  DB_NAME_ENV,
  DB_PASSWORD_ENV,
  DB_PORT_ENV,
  DB_SYNCHRONIZE,
  DB_USERNAME_ENV,
  DEFAULT_DB_HOST,
  DEFAULT_DB_NAME,
  DEFAULT_DB_PASSWORD,
  DEFAULT_DB_PORT,
  DEFAULT_DB_USERNAME,
} from './database.constants';
import { Material } from '../material/material.entity';
import { QuizAttempt } from '../quiz-attempt/quiz-attempt.entity';
import { Quiz } from '../quiz/quiz.entity';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { User } from '../user/user.entity';

/**
 * Builds TypeORM connection options from environment variables.
 */
export function buildTypeOrmConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>(DB_HOST_ENV, DEFAULT_DB_HOST),
    port: configService.get<number>(DB_PORT_ENV, DEFAULT_DB_PORT),
    username: configService.get<string>(DB_USERNAME_ENV, DEFAULT_DB_USERNAME),
    password: configService.get<string>(DB_PASSWORD_ENV, DEFAULT_DB_PASSWORD),
    database: configService.get<string>(DB_NAME_ENV, DEFAULT_DB_NAME),
    entities: [User, RefreshToken, Material, Quiz, QuizAttempt],
    synchronize: DB_SYNCHRONIZE,
  };
}
