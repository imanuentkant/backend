import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthAppModule } from './AuthAppModule';
import { join } from 'path';

async function bootstrap() {
  // HTTP Server (REST APIs)
  const app = await NestFactory.create(AuthAppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/auth');

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || '*',
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Authentication & Authorization Microservice')
    .setVersion('1.0.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      service: 'auth-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  const httpPort = configService.get('PORT') || 3007;
  await app.listen(httpPort);

  // gRPC Server (DISABLED - Using Kafka instead)
  // const grpcPort = configService.get('GRPC_PORT') || 50051;
  // const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AuthAppModule,
  //   {
  //     transport: Transport.GRPC,
  //     options: {
  //       package: 'auth',
  //       protoPath: join(__dirname, '../../../shared/proto/auth.proto'),
  //       url: `0.0.0.0:${grpcPort}`,
  //     },
  //   },
  // );
  // await grpcApp.listen();

  console.log(`
  ╔════════════════════════════════════════════╗
  ║  🔐 AUTH SERVICE - MICROSERVICE           ║
  ║  HTTP Port: ${httpPort}                           ║
  ║  Communication: HTTP + Kafka               ║
  ║  Docs: http://localhost:${httpPort}/api/docs      ║
  ║  Health: http://localhost:${httpPort}/health      ║
  ║  Status: READY ✅                          ║
  ╚════════════════════════════════════════════╝
  `);
}

bootstrap().catch(err => {
  console.error('❌ Failed to start Auth Service:', err);
  process.exit(1);
});

