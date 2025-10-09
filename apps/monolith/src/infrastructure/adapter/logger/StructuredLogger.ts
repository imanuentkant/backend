import { LoggerService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Structured logger cho production
 * Output JSON format để dễ parse bởi log aggregators (ELK, Loki, etc.)
 */
@Injectable()
export class StructuredLogger implements LoggerService {
  private context?: string;
  private readonly isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, context?: string) {
    this.printMessage('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.printMessage('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    this.printMessage('warn', message, context);
  }

  debug(message: string, context?: string) {
    if (this.isProduction) return; // No debug logs in production
    this.printMessage('debug', message, context);
  }

  verbose(message: string, context?: string) {
    if (this.isProduction) return;
    this.printMessage('verbose', message, context);
  }

  private printMessage(
    level: string,
    message: string,
    context?: string,
    trace?: string,
  ) {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      context: context || this.context || 'Application',
      message,
      ...(trace && { trace }),
      environment: this.configService.get('NODE_ENV'),
      service: this.configService.get('SERVICE_NAME', 'backend'),
      version: this.configService.get('API_VERSION', '1.0.0'),
    };

    if (this.isProduction) {
      // Production: JSON format cho log aggregators
      console.log(JSON.stringify(logObject));
    } else {
      // Development: human-readable format
      const timestamp = new Date().toISOString();
      const coloredLevel = this.colorizeLevel(level);
      const contextStr = context || this.context || 'App';
      console.log(`[${timestamp}] ${coloredLevel} [${contextStr}] ${message}`);
      if (trace) {
        console.log(trace);
      }
    }
  }

  private colorizeLevel(level: string): string {
    const colors: Record<string, string> = {
      info: '\x1b[32m',    // Green
      error: '\x1b[31m',   // Red
      warn: '\x1b[33m',    // Yellow
      debug: '\x1b[36m',   // Cyan
      verbose: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';
    return `${colors[level] || ''}${level.toUpperCase()}${reset}`;
  }

  /**
   * Log với metadata bổ sung
   */
  logWithMetadata(
    level: string,
    message: string,
    metadata: Record<string, any>,
    context?: string,
  ) {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      context: context || this.context || 'Application',
      message,
      ...metadata,
      environment: this.configService.get('NODE_ENV'),
      service: this.configService.get('SERVICE_NAME', 'backend'),
    };

    console.log(JSON.stringify(logObject));
  }
}

