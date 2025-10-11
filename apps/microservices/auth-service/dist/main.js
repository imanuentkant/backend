"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const AuthAppModule_1 = require("./AuthAppModule");
async function bootstrap() {
    const app = await core_1.NestFactory.create(AuthAppModule_1.AuthAppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api/auth');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || '*',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Auth Service API')
        .setDescription('Authentication & Authorization Microservice - Clean Architecture')
        .setVersion('2.0.0')
        .addTag('auth', 'Authentication endpoints')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
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
//# sourceMappingURL=main.js.map