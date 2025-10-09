import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PaymentAppModule } from './PaymentAppModule';

async function bootstrap() {
  const app = await NestFactory.create(PaymentAppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: '*', credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Payment Service API')
    .setDescription('Payment processing & transactions')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ service: 'payment-service', status: 'healthy', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3008;
  await app.listen(port);
  console.log(`💳 Payment Service running on port ${port}`);
}

bootstrap();

