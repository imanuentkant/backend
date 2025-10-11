import { Nullable } from '@core/common/type/CommonTypes';
export interface RemovableEntity {
    getRemovedAt(): Nullable<Date>;
    remove(): Promise<void>;
}
