import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * UserReport Entity - Report inappropriate users
 */
export class UserReport extends Entity<string> {
  private reporterId: string;
  private reportedId: string;
  private reason: ReportReason;
  private description: Nullable<string>;
  private status: ReportStatus;
  private reviewedBy: Nullable<string>;
  private reviewedAt: Nullable<Date>;
  private actionTaken: Nullable<string>;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    reporterId: string;
    reportedId: string;
    reason: ReportReason;
    description?: string;
    status?: ReportStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    actionTaken?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.reporterId = payload.reporterId;
    this.reportedId = payload.reportedId;
    this.reason = payload.reason;
    this.description = payload.description || null;
    this.status = payload.status || ReportStatus.PENDING;
    this.reviewedBy = payload.reviewedBy || null;
    this.reviewedAt = payload.reviewedAt || null;
    this.actionTaken = payload.actionTaken || null;
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getReporterId(): string { return this.reporterId; }
  public getReportedId(): string { return this.reportedId; }
  public getReason(): ReportReason { return this.reason; }
  public getDescription(): Nullable<string> { return this.description; }
  public getStatus(): ReportStatus { return this.status; }
  public getReviewedBy(): Nullable<string> { return this.reviewedBy; }
  public getReviewedAt(): Nullable<Date> { return this.reviewedAt; }
  public getActionTaken(): Nullable<string> { return this.actionTaken; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  // Business methods
  public resolve(adminId: string, action: string): void {
    this.status = ReportStatus.RESOLVED;
    this.reviewedBy = adminId;
    this.reviewedAt = new Date();
    this.actionTaken = action;
    this.updatedAt = new Date();
  }

  public dismiss(adminId: string): void {
    this.status = ReportStatus.DISMISSED;
    this.reviewedBy = adminId;
    this.reviewedAt = new Date();
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === ReportStatus.PENDING;
  }
}

export enum ReportReason {
  FAKE_PROFILE = 'fake_profile',
  INAPPROPRIATE_PHOTOS = 'inappropriate_photos',
  HARASSMENT = 'harassment',
  SPAM = 'spam',
  UNDERAGE = 'underage',
  SCAM = 'scam',
  OFFENSIVE_CONTENT = 'offensive_content',
  OTHER = 'other',
}

export enum ReportStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}
