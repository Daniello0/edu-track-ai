import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORT } from './common/constants/app.constants';
import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS HTTP server.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port);
}

void bootstrap();
