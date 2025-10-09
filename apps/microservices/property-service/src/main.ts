import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PropertyAppModule } from './PropertyAppModule';

async function bootstrap() {
  const app = await NestFactory.create(PropertyAppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Property Service API')
    .setDescription('Microservice for Property/Airbnb management')
    .setVersion('1.0.0')
    .addServer('http://localhost:3002', 'Local')
    .addServer('https://property-service.trungtamtrochoi.com', 'Production')
    .addBearerAuth()
    .addTag('Properties', 'Property CRUD operations')
    .addTag('Search', 'Property search & filters')
    .addTag('Calendar', 'Availability management')
    .addTag('Reviews', 'Property reviews & ratings')
    .addTag('Wishlist', 'User wishlist management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      service: 'property-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🏠 PROPERTY SERVICE                                      ║
║                                                           ║
║  Port:        ${port}                                           ║
║  Docs:        http://localhost:${port}/api/docs              ║
║  Health:      http://localhost:${port}/health                ║
║                                                           ║
║  Features:                                                ║
║  ✅ Property CRUD                                         ║
║  ✅ Search & Filters                                      ║
║  ✅ Availability Calendar                                 ║
║  ✅ Reviews & Ratings                                     ║
║  ✅ Wishlist                                              ║
║  ✅ Kafka Events                                          ║
║                                                           ║
║  Status: 🎉 READY                                         ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap();

