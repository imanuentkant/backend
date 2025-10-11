import { validate, ValidationError } from 'class-validator';
import { Optional } from '@core/common/type/CommonTypes';

export type ClassValidationDetails = {
  context: string;
  errors: ValidationError[];
};

export class ClassValidator {
  public static async validate<TClass extends object>(
    classInstance: TClass,
    context?: string,
  ): Promise<Optional<ClassValidationDetails>> {
    const errors: ValidationError[] = await validate(classInstance);
    
    if (errors.length > 0) {
      return {
        context: context || classInstance.constructor.name,
        errors: errors,
      };
    }
    
    return undefined;
  }
}

