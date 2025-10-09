import { ValidationPipe as NestValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * Custom validation pipe với error handling tốt hơn
 */
export class CustomValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true, // Strip properties không có trong DTO
      forbidNonWhitelisted: true, // Throw error nếu có properties không mong muốn
      forbidUnknownValues: true, // Reject unknown values
      transform: true, // Tự động transform types
      transformOptions: {
        enableImplicitConversion: true, // Convert string to number, etc.
      },
      exceptionFactory: (errors: ValidationError[]) => {
        // Format error messages đẹp hơn
        const messages = errors.map((error) => {
          const constraints = error.constraints;
          if (constraints) {
            return {
              field: error.property,
              errors: Object.values(constraints),
            };
          }
          return null;
        }).filter(Boolean);

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        });
      },
    });
  }
}

