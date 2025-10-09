import { Entity } from '@core/common/entity/Entity';
import { Nullable } from '@core/common/type/CommonTypes';

/**
 * DateProposal Entity - Propose a date meeting
 */
export class DateProposal extends Entity<string> {
  private matchId: string;
  private proposedBy: string;
  private proposedTo: string;
  private proposedDate: Date;
  private location: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  private activity: string;
  private notes: Nullable<string>;
  private status: DateProposalStatus;
  private respondedAt: Nullable<Date>;
  private responseMessage: Nullable<string>;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(payload: {
    id?: string;
    matchId: string;
    proposedBy: string;
    proposedTo: string;
    proposedDate: Date;
    location: {
      name: string;
      address: string;
      latitude?: number;
      longitude?: number;
    };
    activity: string;
    notes?: string;
    status?: DateProposalStatus;
    respondedAt?: Date;
    responseMessage?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super();
    this.id = payload.id;
    this.matchId = payload.matchId;
    this.proposedBy = payload.proposedBy;
    this.proposedTo = payload.proposedTo;
    this.proposedDate = payload.proposedDate;
    this.location = payload.location;
    this.activity = payload.activity;
    this.notes = payload.notes || null;
    this.status = payload.status || DateProposalStatus.PENDING;
    this.respondedAt = payload.respondedAt || null;
    this.responseMessage = payload.responseMessage || null;
    this.createdAt = payload.createdAt || new Date();
    this.updatedAt = payload.updatedAt || new Date();
  }

  // Getters
  public getMatchId(): string { return this.matchId; }
  public getProposedBy(): string { return this.proposedBy; }
  public getProposedTo(): string { return this.proposedTo; }
  public getProposedDate(): Date { return this.proposedDate; }
  public getLocation(): any { return this.location; }
  public getActivity(): string { return this.activity; }
  public getNotes(): Nullable<string> { return this.notes; }
  public getStatus(): DateProposalStatus { return this.status; }
  public getRespondedAt(): Nullable<Date> { return this.respondedAt; }
  public getResponseMessage(): Nullable<string> { return this.responseMessage; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }

  // Business methods
  public accept(message?: string): void {
    this.status = DateProposalStatus.ACCEPTED;
    this.respondedAt = new Date();
    this.responseMessage = message || null;
    this.updatedAt = new Date();
  }

  public decline(message?: string): void {
    this.status = DateProposalStatus.DECLINED;
    this.respondedAt = new Date();
    this.responseMessage = message || null;
    this.updatedAt = new Date();
  }

  public cancel(): void {
    this.status = DateProposalStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  public markAsCompleted(): void {
    this.status = DateProposalStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === DateProposalStatus.PENDING;
  }

  public isAccepted(): boolean {
    return this.status === DateProposalStatus.ACCEPTED;
  }
}

export enum DateProposalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}
