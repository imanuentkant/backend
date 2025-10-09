import { ProfileView } from '../entity/ProfileView';

export interface ProfileViewRepositoryPort {
  save(view: ProfileView): Promise<ProfileView>;
  
  findByProfileId(profileId: string): Promise<ProfileView[]>;
  
  countByProfileId(profileId: string): Promise<number>;
  
  countByProfileIdAndDateRange(profileId: string, startDate: Date, endDate: Date): Promise<number>;
  
  getRecentViewers(profileId: string, limit: number): Promise<ProfileView[]>;
}

