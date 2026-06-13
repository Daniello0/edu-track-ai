import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  API_TITLE,
  API_VERSION,
  DEFAULT_PORT,
  SWAGGER_PATH,
} from './common/constants/app.constants';
import { AppModule } from './app.module';

/**
 * Registers OpenAPI documentation and Swagger UI on the NestJS app.
 */
function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription('EduTrack AI NestJS API')
    .setVersion(API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
}

/**
 * Bootstraps the NestJS HTTP server.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port);
}

void bootstrap();
