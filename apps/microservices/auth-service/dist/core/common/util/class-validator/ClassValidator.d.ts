import { ValidationError } from 'class-validator';
import { Optional } from '@core/common/type/CommonTypes';
export type ClassValidationDetails = {
    context: string;
    errors: ValidationError[];
};
export declare class ClassValidator {
    static validate<TClass extends object>(classInstance: TClass, context?: string): Promise<Optional<ClassValidationDetails>>;
}
