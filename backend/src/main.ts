import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { Request, Response } from 'express';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // API prefix
  app.setGlobalPrefix('api');

  // OpenAPI document + Scalar interactive UI
  const config = new DocumentBuilder()
    .setTitle('Horizon Supply Co. API')
    .setDescription('E-commerce REST API — Horizon Supply Co.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use('/api-json', (_req: Request, res: Response) => res.json(document));
  app.use(
    '/api/docs',
    apiReference({
      spec: { content: document },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
