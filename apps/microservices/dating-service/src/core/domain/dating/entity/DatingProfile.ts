import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * DatingProfile Entity - Customer profile cho dating system
 */
export class DatingProfile extends Entity<string> {
  private customerId: string;
  private displayName: string;
  private bio: string;
  private age: number;
  private gender: Gender;
  private interestedIn: Gender[];
  private location: {
    city: string;
    state: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  private photos: string[];
  private interests: string[];
  private occupation: Nullable<string>;
  private education: Nullable<string>;
  private height: Nullable<number>; // cm
  private lookingFor: LookingFor;
  private isActive: boolean;
  private isVerified: boolean;
  private isPremium: boolean;
  private lastActiveAt: Date;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    customerId: string;
    displayName: string;
    bio: string;
    age: number;
    gender: Gender;
    interestedIn: Gender[];
    location: {
      city: string;
      state: string;
      country: string;
      latitude?: number;
      longitude?: number;
    };
    photos?: string[];
    interests?: string[];
    occupation?: string;
    education?: string;
    height?: number;
    lookingFor?: LookingFor;
    isActive?: boolean;
    isVerified?: boolean;
    isPremium?: boolean;
    lastActiveAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.customerId = payload.customerId;
    this.displayName = payload.displayName;
    this.bio = payload.bio;
    this.age = payload.age;
    this.gender = payload.gender;
    this.interestedIn = payload.interestedIn;
    this.location = payload.location;
    this.photos = payload.photos || [];
    this.interests = payload.interests || [];
    this.occupation = payload.occupation || null;
    this.education = payload.education || null;
    this.height = payload.height || null;
    this.lookingFor = payload.lookingFor || LookingFor.RELATIONSHIP;
    this.isActive = payload.isActive !== undefined ? payload.isActive : true;
    this.isVerified = payload.isVerified || false;
    this.isPremium = payload.isPremium || false;
    this.lastActiveAt = payload.lastActiveAt || new Date();
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getCustomerId(): string { return this.customerId; }
  public getDisplayName(): string { return this.displayName; }
  public getBio(): string { return this.bio; }
  public getAge(): number { return this.age; }
  public getGender(): Gender { return this.gender; }
  public getInterestedIn(): Gender[] { return [...this.interestedIn]; }
  public getLocation(): any { return this.location; }
  public getPhotos(): string[] { return [...this.photos]; }
  public getInterests(): string[] { return [...this.interests]; }
  public getOccupation(): Nullable<string> { return this.occupation; }
  public getEducation(): Nullable<string> { return this.education; }
  public getHeight(): Nullable<number> { return this.height; }
  public getLookingFor(): LookingFor { return this.lookingFor; }
  public isProfileActive(): boolean { return this.isActive; }
  public isProfileVerified(): boolean { return this.isVerified; }
  public isProfilePremium(): boolean { return this.isPremium; }
  public getLastActiveAt(): Date { return this.lastActiveAt; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  // Business methods
  public updateBio(bio: string): void {
    this.bio = bio;
    this.updatedAt = new Date();
  }

  public addPhoto(photoUrl: string): void {
    if (this.photos.length < 9) {
      this.photos.push(photoUrl);
      this.updatedAt = new Date();
    }
  }

  public removePhoto(photoUrl: string): void {
    this.photos = this.photos.filter(p => p !== photoUrl);
    this.updatedAt = new Date();
  }

  public addInterest(interest: string): void {
    if (!this.interests.includes(interest)) {
      this.interests.push(interest);
      this.updatedAt = new Date();
    }
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public markAsActive(): void {
    this.lastActiveAt = new Date();
  }

  public verify(): void {
    this.isVerified = true;
    this.updatedAt = new Date();
  }

  public upgradeToPremium(): void {
    this.isPremium = true;
    this.updatedAt = new Date();
  }
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  OTHER = 'other',
}

export enum LookingFor {
  RELATIONSHIP = 'relationship',
  FRIENDSHIP = 'friendship',
  CASUAL = 'casual',
  MARRIAGE = 'marriage',
}
