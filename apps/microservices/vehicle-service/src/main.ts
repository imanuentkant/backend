import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VehicleAppModule } from './VehicleAppModule';

async function bootstrap() {
  const app = await NestFactory.create(VehicleAppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: '*', credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Vehicle Service API')
    .setDescription('Vehicle rental management')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ service: 'vehicle-service', status: 'healthy', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`🚗 Vehicle Service running on port ${port}`);
}

bootstrap();

