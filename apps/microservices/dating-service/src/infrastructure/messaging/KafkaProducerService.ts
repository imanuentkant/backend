import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private readonly clientId = 'dating-service-producer';

  constructor() {
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.getBrokers(),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
      connectionTimeout: 30000,
      requestTimeout: 30000,
    });
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });
  }

  private getBrokers(): string[] {
    const brokersEnv = process.env.KAFKA_BROKERS;
    if (brokersEnv) {
      return brokersEnv.split(',');
    }
    return ['localhost:19092']; // Default for development
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      console.log(`✅ [Kafka Producer] Connected - Client: ${this.clientId}`);
    } catch (error) {
      console.error('❌ [Kafka Producer] Connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      console.log('👋 [Kafka Producer] Disconnected');
    } catch (error) {
      console.error('❌ [Kafka Producer] Disconnect failed:', error);
    }
  }

  /**
   * Generic method to publish any event to Kafka
   */
  async publishEvent<T>(
    topic: string,
    eventType: string,
    data: T,
    key?: string,
  ): Promise<void> {
    const event = {
      eventType,
      eventId: uuidv7(),
      timestamp: new Date().toISOString(),
      sourceService: 'dating-service',
      data,
    };

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: key || event.eventId,
            value: JSON.stringify(event),
            headers: {
              'event-type': eventType,
              'source-service': 'dating-service',
              'event-id': event.eventId,
              'timestamp': event.timestamp,
            },
          },
        ],
      });

      console.log(`📤 [Kafka] Event published: ${topic} - ${eventType} (ID: ${event.eventId})`);
    } catch (error) {
      console.error(`❌ [Kafka] Failed to publish event to ${topic}:`, error);
      throw error;
    }
  }

  // ============================================
  // Profile Events
  // ============================================

  async publishProfileCreated(
    profileId: string,
    customerId: string,
    displayName: string,
    gender: string,
    dateOfBirth: Date,
    location: { latitude: number; longitude: number; city: string; country: string },
  ): Promise<void> {
    await this.publishEvent(
      'dating.profile.created',
      'dating.profile.created',
      {
        profileId,
        customerId,
        displayName,
        gender,
        dateOfBirth: dateOfBirth.toISOString(),
        location,
      },
      customerId, // Use customerId as key for partitioning
    );
  }

  async publishProfileUpdated(
    profileId: string,
    customerId: string,
    updatedFields: string[],
  ): Promise<void> {
    await this.publishEvent(
      'dating.profile.updated',
      'dating.profile.updated',
      { profileId, customerId, updatedFields },
      customerId,
    );
  }

  async publishProfileDeleted(
    profileId: string,
    customerId: string,
    reason?: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.profile.deleted',
      'dating.profile.deleted',
      { profileId, customerId, reason },
      customerId,
    );
  }

  // ============================================
  // Swipe Events
  // ============================================

  async publishSwipePerformed(
    swipeId: string,
    swiperId: string,
    swiperProfileId: string,
    targetId: string,
    targetProfileId: string,
    action: 'LIKE' | 'PASS' | 'SUPER_LIKE',
  ): Promise<void> {
    await this.publishEvent(
      'dating.swipe.performed',
      'dating.swipe.performed',
      {
        swipeId,
        swiperId,
        swiperProfileId,
        targetId,
        targetProfileId,
        action,
      },
      swiperId, // Partition by swiper for ordered processing
    );
  }

  async publishSwipeLimitReached(
    customerId: string,
    dailyLimit: number,
    isPremium: boolean,
  ): Promise<void> {
    await this.publishEvent(
      'dating.swipe.limit.reached',
      'dating.swipe.limit.reached',
      { customerId, dailyLimit, isPremium },
      customerId,
    );
  }

  // ============================================
  // Match Events
  // ============================================

  async publishMatchCreated(
    matchId: string,
    user1Id: string,
    user1ProfileId: string,
    user2Id: string,
    user2ProfileId: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.match.created',
      'dating.match.created',
      {
        matchId,
        user1Id,
        user1ProfileId,
        user2Id,
        user2ProfileId,
      },
      matchId,
    );
  }

  async publishMatchUnmatched(
    matchId: string,
    unmatchedBy: string,
    reason?: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.match.unmatched',
      'dating.match.unmatched',
      { matchId, unmatchedBy, reason },
      matchId,
    );
  }

  // ============================================
  // Date Proposal Events
  // ============================================

  async publishDateProposalCreated(
    proposalId: string,
    fromUserId: string,
    toUserId: string,
    matchId: string,
    proposedDate: Date,
    location: string,
    message?: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.date.proposal.created',
      'dating.date.proposal.created',
      {
        proposalId,
        fromUserId,
        toUserId,
        matchId,
        proposedDate: proposedDate.toISOString(),
        location,
        message,
      },
      proposalId,
    );
  }

  async publishDateProposalResponded(
    proposalId: string,
    response: 'ACCEPTED' | 'REJECTED' | 'COUNTER',
    respondedBy: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.date.proposal.responded',
      'dating.date.proposal.responded',
      { proposalId, response, respondedBy },
      proposalId,
    );
  }

  // ============================================
  // Subscription Events
  // ============================================

  async publishSubscriptionCreated(
    subscriptionId: string,
    customerId: string,
    plan: 'PREMIUM' | 'GOLD',
    startDate: Date,
    endDate: Date,
    price: number,
  ): Promise<void> {
    await this.publishEvent(
      'dating.subscription.created',
      'dating.subscription.created',
      {
        subscriptionId,
        customerId,
        plan,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        price,
      },
      customerId,
    );
  }

  async publishBoostActivated(
    boostId: string,
    customerId: string,
    profileId: string,
    durationMinutes: number,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    await this.publishEvent(
      'dating.boost.activated',
      'dating.boost.activated',
      {
        boostId,
        customerId,
        profileId,
        durationMinutes,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
      customerId,
    );
  }

  // ============================================
  // Block & Report Events
  // ============================================

  async publishUserBlocked(
    blockerId: string,
    blockedId: string,
    reason?: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.user.blocked',
      'dating.user.blocked',
      { blockerId, blockedId, reason },
      blockerId,
    );
  }

  async publishUserReported(
    reporterId: string,
    reportedId: string,
    reason: string,
    description?: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.user.reported',
      'dating.user.reported',
      { reporterId, reportedId, reason, description },
      reporterId,
    );
  }

  // ============================================
  // Profile View Events
  // ============================================

  async publishProfileViewed(
    viewerId: string,
    viewedProfileId: string,
    viewedUserId: string,
  ): Promise<void> {
    await this.publishEvent(
      'dating.profile.viewed',
      'dating.profile.viewed',
      { viewerId, viewedProfileId, viewedUserId },
      viewerId,
    );
  }
}

