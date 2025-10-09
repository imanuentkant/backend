import { DatingSettings } from '../entity/DatingSettings';
import { Nullable } from '@core/common/type/CommonTypes';

export interface DatingSettingsRepositoryPort {
  save(settings: DatingSettings): Promise<DatingSettings>;
  
  findByCustomerId(customerId: string): Promise<Nullable<DatingSettings>>;
  
  update(settings: DatingSettings): Promise<DatingSettings>;
  
  delete(id: string): Promise<void>;
}

