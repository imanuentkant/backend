import { Optional } from '@core/common/type/CommonTypes';
export declare class Entity<TIdentifier extends string | number> {
    protected id: Optional<TIdentifier>;
    getId(): TIdentifier;
    validate(): Promise<void>;
}
