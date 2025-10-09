import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MessageAppModule } from './MessageAppModule';

async function bootstrap() {
  const app = await NestFactory.create(MessageAppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: '*', credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Message Service API')
    .setDescription('Real-time messaging & conversations')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ service: 'message-service', status: 'healthy', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3006;
  await app.listen(port);
  console.log(`💬 Message Service running on port ${port}`);
}

bootstrap();

