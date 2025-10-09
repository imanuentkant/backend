import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DatingAppModule } from './DatingAppModule';

async function bootstrap() {
  const app = await NestFactory.create(DatingAppModule);

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/dating');

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Dating Service API')
    .setDescription('Microservice for Dating features - 24 Production APIs')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${configService.get('PORT') || 3001}`, 'Local')
    .addServer('https://api.trungtamtrochoi.com', 'Production')
    .addBearerAuth()
    .addTag('Dating', 'Dating system endpoints')
    .addTag('Premium', 'Premium subscription features')
    .addTag('Analytics', 'Profile analytics & stats')
    .addTag('Safety', 'Block & Report features')
    .addTag('Settings', 'User preferences')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      service: 'dating-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  // Start
  const port = configService.get('PORT') || 3001;
  await app.listen(port);

  console.log(`
  ╔════════════════════════════════════════════╗
  ║  💘 DATING SERVICE - MICROSERVICE         ║
  ║  Port: ${port}                                ║
  ║  Docs: http://localhost:${port}/api/docs      ║
  ║  Health: http://localhost:${port}/health      ║
  ║  APIs: 24 Production Endpoints            ║
  ║  Status: READY ✅                          ║
  ╚════════════════════════════════════════════╝
  `);
}

bootstrap().catch(err => {
  console.error('❌ Failed to start Dating Service:', err);
  process.exit(1);
});

