import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthAppModule } from './AuthAppModule';

async function bootstrap() {
  // HTTP Server (REST APIs)
  const app = await NestFactory.create(AuthAppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/auth');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Authentication & Authorization Microservice - Clean Architecture')
    .setVersion('2.0.0')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      service: 'auth-service',
      status: 'healthy',
      architecture: 'Clean Architecture',
      timestamp: new Date().toISOString(),
    });
  });

  const httpPort = configService.get('PORT') || 3007;
  await app.listen(httpPort);

  console.log(`
  ╔════════════════════════════════════════════╗
  ║  🔐 AUTH SERVICE - CLEAN ARCHITECTURE     ║
  ║  HTTP Port: ${httpPort}                           ║
  ║  Communication: HTTP + Kafka               ║
  ║  Docs: http://localhost:${httpPort}/api/docs      ║
  ║  Health: http://localhost:${httpPort}/health      ║
  ║  Status: READY ✅                          ║
  ╚════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Auth Service:', err);
  process.exit(1);
});
