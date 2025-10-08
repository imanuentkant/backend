import { TimestampedEntity } from '@core/common/entity/TimestampedEntity';

export class Review extends TimestampedEntity<string> {
  
  private bookingId: string;
  private propertyId: string;
  private reviewerId: string;  // guest
  private revieweeId: string;  // host
  private ratingOverall: number;
  private ratingCleanliness: number;
  private ratingAccuracy: number;
  private ratingCheckin: number;
  private ratingCommunication: number;
  private ratingLocation: number;
  private ratingValue: number;
  private comment: string;
  private response?: string;  // host response
  private isPublished: boolean;
  private publishedAt?: Date;
  
  constructor(payload: {
    id?: string,
    bookingId: string,
    propertyId: string,
    reviewerId: string,
    revieweeId: string,
    ratingOverall: number,
    ratingCleanliness: number,
    ratingAccuracy: number,
    ratingCheckin: number,
    ratingCommunication: number,
    ratingLocation: number,
    ratingValue: number,
    comment: string,
    response?: string,
    isPublished?: boolean,
    publishedAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(payload.id, payload.createdAt, payload.updatedAt);
    this.bookingId = payload.bookingId;
    this.propertyId = payload.propertyId;
    this.reviewerId = payload.reviewerId;
    this.revieweeId = payload.revieweeId;
    this.ratingOverall = payload.ratingOverall;
    this.ratingCleanliness = payload.ratingCleanliness;
    this.ratingAccuracy = payload.ratingAccuracy;
    this.ratingCheckin = payload.ratingCheckin;
    this.ratingCommunication = payload.ratingCommunication;
    this.ratingLocation = payload.ratingLocation;
    this.ratingValue = payload.ratingValue;
    this.comment = payload.comment;
    this.response = payload.response;
    this.isPublished = payload.isPublished || false;
    this.publishedAt = payload.publishedAt;
  }
  
  public static async new(payload: {
    bookingId: string,
    propertyId: string,
    reviewerId: string,
    revieweeId: string,
    ratingOverall: number,
    ratingCleanliness: number,
    ratingAccuracy: number,
    ratingCheckin: number,
    ratingCommunication: number,
    ratingLocation: number,
    ratingValue: number,
    comment: string,
  }): Promise<Review> {
    const review: Review = new Review(payload);
    await review.validate();
    
    return review;
  }
  
  public async validate(): Promise<void> {
    // Validate ratings are between 1 and 5
    const ratings = [
      this.ratingOverall,
      this.ratingCleanliness,
      this.ratingAccuracy,
      this.ratingCheckin,
      this.ratingCommunication,
      this.ratingLocation,
      this.ratingValue,
    ];
    
    for (const rating of ratings) {
      if (rating < 1 || rating > 5) {
        throw new Error('All ratings must be between 1 and 5');
      }
    }
    
    if (!this.comment || this.comment.length < 10) {
      throw new Error('Comment must be at least 10 characters');
    }
    
    if (this.comment.length > 1000) {
      throw new Error('Comment must not exceed 1000 characters');
    }
  }
  
  // Getters
  public getBookingId(): string {
    return this.bookingId;
  }
  
  public getPropertyId(): string {
    return this.propertyId;
  }
  
  public getReviewerId(): string {
    return this.reviewerId;
  }
  
  public getRevieweeId(): string {
    return this.revieweeId;
  }
  
  public getRatingOverall(): number {
    return this.ratingOverall;
  }
  
  public getRatingCleanliness(): number {
    return this.ratingCleanliness;
  }
  
  public getRatingAccuracy(): number {
    return this.ratingAccuracy;
  }
  
  public getRatingCheckin(): number {
    return this.ratingCheckin;
  }
  
  public getRatingCommunication(): number {
    return this.ratingCommunication;
  }
  
  public getRatingLocation(): number {
    return this.ratingLocation;
  }
  
  public getRatingValue(): number {
    return this.ratingValue;
  }
  
  public getComment(): string {
    return this.comment;
  }
  
  public getResponse(): string | undefined {
    return this.response;
  }
  
  public getIsPublished(): boolean {
    return this.isPublished;
  }
  
  public getPublishedAt(): Date | undefined {
    return this.publishedAt;
  }
  
  /**
   * Calculate average rating from all category ratings
   */
  public getAverageRating(): number {
    const sum = 
      this.ratingCleanliness +
      this.ratingAccuracy +
      this.ratingCheckin +
      this.ratingCommunication +
      this.ratingLocation +
      this.ratingValue;
    
    return Math.round((sum / 6) * 10) / 10; // Round to 1 decimal
  }
  
  /**
   * Add host response to review
   */
  public addResponse(response: string): void {
    if (!response || response.length < 10) {
      throw new Error('Response must be at least 10 characters');
    }
    if (response.length > 500) {
      throw new Error('Response must not exceed 500 characters');
    }
    
    this.response = response;
    this.updateUpdatedAt();
  }
  
  /**
   * Publish review
   */
  public publish(): void {
    if (this.isPublished) {
      throw new Error('Review is already published');
    }
    
    this.isPublished = true;
    this.publishedAt = new Date();
    this.updateUpdatedAt();
  }
}

