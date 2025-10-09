/**
 * Dating Service Events
 * 
 * These events are published to Kafka when dating-related actions occur.
 * Other services can subscribe to these events to react accordingly.
 */

export interface BaseEvent {
  eventType: string;
  eventId: string;
  timestamp: string;
  sourceService: 'dating-service';
}

// Profile Events
export interface ProfileCreatedEvent extends BaseEvent {
  eventType: 'dating.profile.created';
  data: {
    profileId: string;
    customerId: string;
    displayName: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    dateOfBirth: string;
    location: {
      latitude: number;
      longitude: number;
      city: string;
      country: string;
    };
  };
}

export interface ProfileUpdatedEvent extends BaseEvent {
  eventType: 'dating.profile.updated';
  data: {
    profileId: string;
    customerId: string;
    updatedFields: string[];
  };
}

export interface ProfileDeletedEvent extends BaseEvent {
  eventType: 'dating.profile.deleted';
  data: {
    profileId: string;
    customerId: string;
    reason?: string;
  };
}

// Swipe Events
export interface SwipePerformedEvent extends BaseEvent {
  eventType: 'dating.swipe.performed';
  data: {
    swipeId: string;
    swiperId: string;
    swiperProfileId: string;
    targetId: string;
    targetProfileId: string;
    action: 'LIKE' | 'PASS' | 'SUPER_LIKE';
  };
}

export interface SwipeLimitReachedEvent extends BaseEvent {
  eventType: 'dating.swipe.limit.reached';
  data: {
    customerId: string;
    dailyLimit: number;
    isPremium: boolean;
  };
}

// Match Events
export interface MatchCreatedEvent extends BaseEvent {
  eventType: 'dating.match.created';
  data: {
    matchId: string;
    user1Id: string;
    user1ProfileId: string;
    user2Id: string;
    user2ProfileId: string;
  };
}

export interface MatchUnmatchedEvent extends BaseEvent {
  eventType: 'dating.match.unmatched';
  data: {
    matchId: string;
    unmatchedBy: string;
    reason?: string;
  };
}

// Date Proposal Events
export interface DateProposalCreatedEvent extends BaseEvent {
  eventType: 'dating.date.proposal.created';
  data: {
    proposalId: string;
    fromUserId: string;
    toUserId: string;
    matchId: string;
    proposedDate: string;
    location: string;
    message?: string;
  };
}

export interface DateProposalRespondedEvent extends BaseEvent {
  eventType: 'dating.date.proposal.responded';
  data: {
    proposalId: string;
    response: 'ACCEPTED' | 'REJECTED' | 'COUNTER';
    respondedBy: string;
  };
}

// Premium & Subscription Events
export interface SubscriptionCreatedEvent extends BaseEvent {
  eventType: 'dating.subscription.created';
  data: {
    subscriptionId: string;
    customerId: string;
    plan: 'PREMIUM' | 'GOLD';
    startDate: string;
    endDate: string;
    price: number;
  };
}

export interface SubscriptionUpgradedEvent extends BaseEvent {
  eventType: 'dating.subscription.upgraded';
  data: {
    subscriptionId: string;
    customerId: string;
    oldPlan: string;
    newPlan: string;
  };
}

export interface SubscriptionCancelledEvent extends BaseEvent {
  eventType: 'dating.subscription.cancelled';
  data: {
    subscriptionId: string;
    customerId: string;
    reason?: string;
  };
}

export interface BoostActivatedEvent extends BaseEvent {
  eventType: 'dating.boost.activated';
  data: {
    boostId: string;
    customerId: string;
    profileId: string;
    durationMinutes: number;
    startTime: string;
    endTime: string;
  };
}

// Block & Report Events
export interface UserBlockedEvent extends BaseEvent {
  eventType: 'dating.user.blocked';
  data: {
    blockerId: string;
    blockedId: string;
    reason?: string;
  };
}

export interface UserUnblockedEvent extends BaseEvent {
  eventType: 'dating.user.unblocked';
  data: {
    blockerId: string;
    blockedId: string;
  };
}

export interface UserReportedEvent extends BaseEvent {
  eventType: 'dating.user.reported';
  data: {
    reporterId: string;
    reportedId: string;
    reason: string;
    description?: string;
  };
}

// Profile View Events
export interface ProfileViewedEvent extends BaseEvent {
  eventType: 'dating.profile.viewed';
  data: {
    viewerId: string;
    viewedProfileId: string;
    viewedUserId: string;
  };
}

// Union type for all dating events
export type DatingEvent =
  | ProfileCreatedEvent
  | ProfileUpdatedEvent
  | ProfileDeletedEvent
  | SwipePerformedEvent
  | SwipeLimitReachedEvent
  | MatchCreatedEvent
  | MatchUnmatchedEvent
  | DateProposalCreatedEvent
  | DateProposalRespondedEvent
  | SubscriptionCreatedEvent
  | SubscriptionUpgradedEvent
  | SubscriptionCancelledEvent
  | BoostActivatedEvent
  | UserBlockedEvent
  | UserUnblockedEvent
  | UserReportedEvent
  | ProfileViewedEvent;

