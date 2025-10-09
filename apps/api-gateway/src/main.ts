import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { GatewayModule } from './GatewayModule';
import { JwtAuthGuard } from './auth/guard/JwtAuthGuard';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Get JwtAuthGuard for protected routes
  const jwtAuthGuard = app.get(JwtAuthGuard);

  // Service URLs
  const services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3007',
    dating: process.env.DATING_SERVICE_URL || 'http://localhost:3001',
    property: process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002',
    vehicle: process.env.VEHICLE_SERVICE_URL || 'http://localhost:3003',
    message: process.env.MESSAGE_SERVICE_URL || 'http://localhost:3006',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3008',
  };

  // Route to Dating Service
  app.use('/api/dating', createProxyMiddleware({
    target: services.dating,
    changeOrigin: true,
    pathRewrite: { '^/api/dating': '/api/dating' },
    onProxyReq: (proxyReq: any, req: any) => {
      // Forward user info from JWT to microservice
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id || '');
        proxyReq.setHeader('x-user-email', req.user.email || '');
        proxyReq.setHeader('x-user-role', req.user.role || '');
      }
    },
    onError: (err: any, req: any, res: any) => {
      console.error('Dating Service Error:', err.message);
      res.status(503).json({ error: 'Dating Service unavailable' });
    },
  } as Options));

  // Route to Auth Service
  app.use('/api/auth', createProxyMiddleware({
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/api/auth' },
    onProxyReq: (proxyReq: any, req: any) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id || '');
        proxyReq.setHeader('x-user-email', req.user.email || '');
      }
    },
  } as Options));

  // Route to Property Service
  app.use('/api/properties', createProxyMiddleware({
    target: services.property,
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id || '');
        proxyReq.setHeader('x-user-email', req.user.email || '');
      }
    },
  } as Options));

  // Route to Vehicle Service
  app.use('/api/vehicles', createProxyMiddleware({
    target: services.vehicle,
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id || '');
        proxyReq.setHeader('x-user-email', req.user.email || '');
      }
    },
  } as Options));

  // Route to Message Service
  app.use('/api/messages', createProxyMiddleware({
    target: services.message,
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id || '');
        proxyReq.setHeader('x-user-email', req.user.email || '');
      }
    },
  } as Options));

  // Route to Payment Service
  app.use('/api/payments', createProxyMiddleware({
    target: services.payment,
    changeOrigin: true,
    onProxyReq: (proxyReq: any, req: any) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.id || '');
        proxyReq.setHeader('x-user-email', req.user.email || '');
      }
    },
  } as Options));

  // Swagger (Aggregated)
  const config = new DocumentBuilder()
    .setTitle('Trung Tâm Trợ Chơi - API Gateway')
    .setDescription('Gateway to all microservices')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Local')
    .addServer('https://api.trungtamtrochoi.com', 'Production')
    .addBearerAuth()
    .addTag('Dating', 'Dating Service (port 3001)')
    .addTag('Property', 'Property Service (port 3002)')
    .addTag('Vehicle', 'Vehicle Service (port 3003)')
    .addTag('Auth', 'Auth Service (port 3007)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      service: 'api-gateway',
      status: 'healthy',
      services: {
        dating: services.dating,
        property: services.property,
        auth: services.auth,
      },
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
  ╔════════════════════════════════════════════╗
  ║  🌐 API GATEWAY                           ║
  ║  Port: ${port}                                ║
  ║  Docs: http://localhost:${port}/api/docs      ║
  ║  Health: http://localhost:${port}/health      ║
  ║                                            ║
  ║  Routes:                                   ║
  ║  /api/dating/*    → Dating Service        ║
  ║  /api/properties/* → Property Service     ║
  ║  /api/vehicles/*   → Vehicle Service      ║
  ║  /api/auth/*       → Auth Service         ║
  ║                                            ║
  ║  Status: READY ✅                          ║
  ╚════════════════════════════════════════════╝
  `);
}

bootstrap().catch(err => {
  console.error('❌ Failed to start API Gateway:', err);
  process.exit(1);
});

