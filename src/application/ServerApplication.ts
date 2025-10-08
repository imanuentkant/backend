import { RootModule } from '@application/di/.RootModule';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '@application/api/http-rest/config/SecurityConfig';
import { CustomValidationPipe } from '@application/api/http-rest/pipe/ValidationPipe';
import helmet from 'helmet';
import * as compression from 'compression';

export class ServerApplication {

  public async run(): Promise<void> {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);
    const configService: ConfigService = app.get(ConfigService);
    const securityConfig: SecurityConfig = new SecurityConfig(configService);

    // Security configurations
    this.configureSecurityMiddleware(app, securityConfig);
    
    // Global pipes for validation
    app.useGlobalPipes(new CustomValidationPipe());

    // Compression
    app.use(compression());

    // API Documentation
    this.buildAPIDocumentation(app);

    // Graceful shutdown
    this.setupGracefulShutdown(app);

    const host = configService.get<string>('API_HOST') || 'localhost';
    const port = Number.parseInt(configService.get<string>('API_PORT') || '3005', 10);
    
    this.log(host, port);
    await app.listen(port, host);
    Logger.log(`API server running at: http://${host}:${port}`, ServerApplication.name);
    Logger.log(`Environment: ${configService.get('NODE_ENV', 'development')}`, ServerApplication.name);
    Logger.log(`API Documentation: http://${host}:${port}/documentation`, ServerApplication.name);
  }

  private configureSecurityMiddleware(app: NestExpressApplication, securityConfig: SecurityConfig): void {
    // CORS
    app.enableCors(securityConfig.getCorsConfig());

    // Helmet - Security headers
    app.use(helmet(securityConfig.getHelmetConfig()));

    // Trust proxy (for X-Forwarded-For)
    app.set('trust proxy', 1);
  }

  private setupGracefulShutdown(app: NestExpressApplication): void {
    // Handle graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    
    signals.forEach((signal) => {
      process.on(signal, async () => {
        Logger.log(`Received ${signal}, starting graceful shutdown...`, ServerApplication.name);
        
        try {
          await app.close();
          Logger.log('Application closed successfully', ServerApplication.name);
          process.exit(0);
        } catch (error) {
          Logger.error('Error during shutdown', error, ServerApplication.name);
          process.exit(1);
        }
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      Logger.error('Uncaught Exception', error.stack, ServerApplication.name);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any) => {
      Logger.error('Unhandled Rejection', reason?.stack || reason, ServerApplication.name);
      process.exit(1);
    });
  }
  
  private buildAPIDocumentation(app: NestExpressApplication): void {
    const configService: ConfigService = app.get(ConfigService);
    const title: string = configService.get<string>('API_TITLE', 'API');
    const description: string = configService.get<string>('API_DESCRIPTION', 'API Documentation');
    const version: string = configService.get('API_VERSION', '1.0.0');
    
    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .build();
    
    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);
    
    SwaggerModule.setup('documentation', app, document);
  }
  
  private log(host: string, port: number): void {
    Logger.log(`Server started on host: ${host}; port: ${port};`, ServerApplication.name);
  }
  
  public static new(): ServerApplication {
    return new ServerApplication();
  }
  
}
