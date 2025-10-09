# 🚀 KAFKA MICROSERVICES ARCHITECTURE

## 📅 Ngày: October 9, 2025

---

## 🎯 YÊU CẦU

### Kịch bản:
- ✅ Services chạy trên **nhiều VPS khác nhau**
- ✅ Cần **async communication** (không chờ response)
- ✅ Cần **event-driven** architecture
- ✅ High throughput, scalable

### Giải pháp: **KAFKA**

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY (VPS 1)                           │
│  • JWT Validation                                               │
│  • HTTP → Kafka Events                                          │
│  • Port 3000                                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Produce Events
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   KAFKA CLUSTER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Broker 1   │  │   Broker 2   │  │   Broker 3   │          │
│  │   (VPS 2)    │  │   (VPS 3)    │  │   (VPS 4)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  TOPICS:                                                        │
│  • dating.profile.created                                       │
│  • dating.swipe.performed                                       │
│  • dating.match.created                                         │
│  • property.booking.requested                                   │
│  • payment.completed                                            │
│  • user.registered                                              │
└──────┬────────────────┬────────────────┬─────────────┬──────────┘
       │                │                │             │
       │ Consume        │ Consume        │ Consume     │ Consume
       ▼                ▼                ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Dating    │  │  Property   │  │   Message   │  │  Analytics  │
│  Service    │  │  Service    │  │  Service    │  │  Service    │
│  (VPS 5)    │  │  (VPS 6)    │  │  (VPS 7)    │  │  (VPS 8)    │
│             │  │             │  │             │  │             │
│  • Producer │  │  • Producer │  │  • Consumer │  │  • Consumer │
│  • Consumer │  │  • Consumer │  │  • Producer │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

---

## 🔄 SO SÁNH: HTTP REST vs KAFKA

| Đặc điểm | HTTP REST (Hiện tại) | KAFKA (Tương lai) |
|----------|---------------------|-------------------|
| **Communication** | Synchronous | Asynchronous |
| **Coupling** | Tight (service phải online) | Loose (fire & forget) |
| **Scalability** | Limited | Excellent |
| **Throughput** | ~1K req/s | ~1M msg/s |
| **Reliability** | Retry manually | Auto retry + persistence |
| **Multi-VPS** | ❌ Complex (service discovery) | ✅ Easy (Kafka as broker) |
| **Event History** | ❌ Lost | ✅ Stored (configurable) |
| **Fan-out** | ❌ N calls for N services | ✅ 1 publish, N subscribers |

---

## 📊 KAFKA TOPICS DESIGN

### Dating Service Topics:

```yaml
# Profile Events
dating.profile.created
dating.profile.updated
dating.profile.deleted

# Swipe Events
dating.swipe.performed
dating.swipe.limit.reached

# Match Events
dating.match.created
dating.match.conversation.started

# Premium Events
dating.subscription.created
dating.subscription.upgraded
dating.boost.activated
```

### Property Service Topics:

```yaml
# Booking Events
property.booking.requested
property.booking.confirmed
property.booking.cancelled

# Property Events
property.created
property.updated
property.availability.changed
```

### Cross-Service Topics:

```yaml
# User Events
user.registered            → Auth Service produces
user.profile.completed     → Auth Service produces

# Payment Events
payment.initiated          → Payment Service produces
payment.completed          → Payment Service consumes
payment.failed             → Payment Service produces

# Notification Events
notification.email.send    → Any service produces
notification.sms.send      → Any service produces
notification.push.send     → Any service produces
```

---

## 🎯 EVENT-DRIVEN FLOW EXAMPLES

### Example 1: User Swipes Right (Match Created)

```
1. Client → API Gateway
   POST /api/dating/swipe
   { targetProfileId, action: "LIKE" }
        ↓
2. Gateway validates JWT
        ↓
3. Gateway produces event:
   Topic: dating.swipe.performed
   Event: {
     swiperId: "user123",
     targetId: "user456",
     action: "LIKE",
     timestamp: "2025-10-09T10:00:00Z"
   }
        ↓
4. Dating Service consumes event
        ↓
5. Dating Service checks for mutual like
        ↓
6. IF mutual like → Dating Service produces:
   Topic: dating.match.created
   Event: {
     matchId: "match789",
     user1Id: "user123",
     user2Id: "user456",
     timestamp: "2025-10-09T10:00:01Z"
   }
        ↓
7. Multiple consumers:
   - Message Service → Create conversation
   - Notification Service → Send push notifications
   - Analytics Service → Track match rate
```

### Example 2: Premium Subscription (Saga Pattern)

```
1. Client purchases premium
        ↓
2. Gateway produces:
   Topic: payment.initiated
   Event: { userId, amount, type: "PREMIUM" }
        ↓
3. Payment Service processes
        ↓
4. IF success → Payment Service produces:
   Topic: payment.completed
   Event: { userId, amount, transactionId }
        ↓
5. Dating Service consumes payment.completed
        ↓
6. Dating Service produces:
   Topic: dating.subscription.created
   Event: { userId, plan: "PREMIUM", startDate, endDate }
        ↓
7. Notification Service → Send confirmation email
```

---

## 🔧 KAFKA SETUP

### Docker Compose (Development)

```yaml
# infrastructure/compose/docker-compose.kafka.yml
version: '3.8'

services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    hostname: zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    volumes:
      - zookeeper-data:/var/lib/zookeeper/data
      - zookeeper-logs:/var/lib/zookeeper/log

  kafka-1:
    image: confluentinc/cp-kafka:7.5.0
    hostname: kafka-1
    container_name: kafka-1
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "19092:19092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka-1:9092,PLAINTEXT_HOST://localhost:19092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    volumes:
      - kafka-1-data:/var/lib/kafka/data

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    depends_on:
      - kafka-1
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka-1:9092
      KAFKA_CLUSTERS_0_ZOOKEEPER: zookeeper:2181

volumes:
  zookeeper-data:
  zookeeper-logs:
  kafka-1-data:
```

### Production Setup (Multi-VPS)

```yaml
# VPS 1: Zookeeper
zookeeper:
  image: confluentinc/cp-zookeeper:7.5.0
  ports:
    - "2181:2181"
  environment:
    ZOOKEEPER_CLIENT_PORT: 2181
    ZOOKEEPER_SERVER_ID: 1
    ZOOKEEPER_SERVERS: zookeeper:2888:3888

# VPS 2: Kafka Broker 1
kafka-1:
  image: confluentinc/cp-kafka:7.5.0
  ports:
    - "9092:9092"
  environment:
    KAFKA_BROKER_ID: 1
    KAFKA_ZOOKEEPER_CONNECT: 'vps1.example.com:2181'
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://vps2.example.com:9092

# VPS 3: Kafka Broker 2
kafka-2:
  image: confluentinc/cp-kafka:7.5.0
  ports:
    - "9092:9092"
  environment:
    KAFKA_BROKER_ID: 2
    KAFKA_ZOOKEEPER_CONNECT: 'vps1.example.com:2181'
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://vps3.example.com:9092

# VPS 4: Kafka Broker 3
kafka-3:
  image: confluentinc/cp-kafka:7.5.0
  ports:
    - "9092:9092"
  environment:
    KAFKA_BROKER_ID: 3
    KAFKA_ZOOKEEPER_CONNECT: 'vps1.example.com:2181'
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://vps4.example.com:9092
```

---

## 💻 CODE IMPLEMENTATION

### Install Dependencies

```bash
npm install kafkajs
npm install @nestjs/microservices
```

### Shared Event Schemas

```typescript
// infrastructure/shared/events/DatingEvents.ts

export interface ProfileCreatedEvent {
  eventType: 'dating.profile.created';
  eventId: string;
  timestamp: string;
  data: {
    profileId: string;
    customerId: string;
    displayName: string;
    gender: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface SwipePerformedEvent {
  eventType: 'dating.swipe.performed';
  eventId: string;
  timestamp: string;
  data: {
    swipeId: string;
    swiperId: string;
    targetId: string;
    action: 'LIKE' | 'PASS' | 'SUPER_LIKE';
  };
}

export interface MatchCreatedEvent {
  eventType: 'dating.match.created';
  eventId: string;
  timestamp: string;
  data: {
    matchId: string;
    user1Id: string;
    user2Id: string;
  };
}
```

---

### Kafka Producer Service

```typescript
// apps/microservices/dating-service/src/infrastructure/messaging/KafkaProducerService.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'dating-service',
      brokers: [
        process.env.KAFKA_BROKER_1 || 'localhost:19092',
        process.env.KAFKA_BROKER_2 || 'localhost:29092',
        process.env.KAFKA_BROKER_3 || 'localhost:39092',
      ],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('✅ Kafka Producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('❌ Kafka Producer disconnected');
  }

  async publishEvent<T>(topic: string, eventType: string, data: T): Promise<void> {
    const event = {
      eventType,
      eventId: uuidv7(),
      timestamp: new Date().toISOString(),
      data,
    };

    await this.producer.send({
      topic,
      messages: [
        {
          key: event.eventId,
          value: JSON.stringify(event),
          headers: {
            'event-type': eventType,
            'source-service': 'dating-service',
          },
        },
      ],
    });

    console.log(`📤 Event published: ${topic} - ${eventType}`);
  }

  async publishProfileCreated(profileId: string, customerId: string, data: any) {
    await this.publishEvent('dating.profile.created', 'dating.profile.created', {
      profileId,
      customerId,
      ...data,
    });
  }

  async publishSwipePerformed(swipeId: string, swiperId: string, targetId: string, action: string) {
    await this.publishEvent('dating.swipe.performed', 'dating.swipe.performed', {
      swipeId,
      swiperId,
      targetId,
      action,
    });
  }

  async publishMatchCreated(matchId: string, user1Id: string, user2Id: string) {
    await this.publishEvent('dating.match.created', 'dating.match.created', {
      matchId,
      user1Id,
      user2Id,
    });
  }
}
```

---

### Kafka Consumer Service

```typescript
// apps/microservices/dating-service/src/infrastructure/messaging/KafkaConsumerService.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'dating-service',
      brokers: [
        process.env.KAFKA_BROKER_1 || 'localhost:19092',
      ],
    });
    this.consumer = this.kafka.consumer({ groupId: 'dating-service-group' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    console.log('✅ Kafka Consumer connected');

    // Subscribe to topics
    await this.consumer.subscribe({
      topics: [
        'payment.completed',
        'user.registered',
      ],
      fromBeginning: false,
    });

    // Start consuming
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage({ topic, partition, message }: EachMessagePayload) {
    const event = JSON.parse(message.value?.toString() || '{}');
    
    console.log(`📥 Received event: ${topic}`, event);

    try {
      switch (topic) {
        case 'payment.completed':
          await this.handlePaymentCompleted(event);
          break;
        case 'user.registered':
          await this.handleUserRegistered(event);
          break;
        default:
          console.warn(`⚠️ Unknown topic: ${topic}`);
      }
    } catch (error) {
      console.error(`❌ Error handling event from ${topic}:`, error);
      // Implement retry logic or dead letter queue
    }
  }

  private async handlePaymentCompleted(event: any) {
    // Create premium subscription
    console.log('💰 Processing payment completed:', event.data);
    // Update dating profile to premium status
  }

  private async handleUserRegistered(event: any) {
    // Auto-create dating profile for new user
    console.log('👤 Processing user registration:', event.data);
  }
}
```

---

### Update Use Case to Publish Events

```typescript
// apps/microservices/dating-service/src/core/service/dating/usecase/SwipeProfileUseCase.ts

import { KafkaProducerService } from '@infrastructure/messaging/KafkaProducerService';

export class SwipeProfileUseCase implements UseCase<SwipeProfileUseCasePayload, SwipeProfileUseCaseResult> {
  constructor(
    private readonly swipeRepository: SwipeRepositoryPort,
    private readonly matchRepository: MatchRepositoryPort,
    private readonly profileRepository: DatingProfileRepositoryPort,
    private readonly kafkaProducer: KafkaProducerService, // ✅ Inject Kafka
  ) {}

  public async execute(payload: SwipeProfileUseCasePayload): Promise<SwipeProfileUseCaseResult> {
    // ... existing swipe logic ...
    
    const swipe = await this.swipeRepository.createSwipe(/* ... */);
    
    // ✅ Publish event to Kafka
    await this.kafkaProducer.publishSwipePerformed(
      swipe.getId(),
      payload.customerId,
      payload.targetProfileId,
      payload.action,
    );
    
    // Check for match
    if (payload.action === SwipeAction.LIKE) {
      const reverseSwipe = await this.swipeRepository.findSwipe(
        payload.targetProfileId,
        payload.customerId,
      );
      
      if (reverseSwipe?.isLike()) {
        // Create match
        const match = await this.matchRepository.createMatch(/* ... */);
        
        // ✅ Publish match event
        await this.kafkaProducer.publishMatchCreated(
          match.getId(),
          payload.customerId,
          payload.targetProfileId,
        );
        
        return {
          swipe,
          matched: true,
          matchId: match.getId(),
        };
      }
    }
    
    return { swipe, matched: false };
  }
}
```

---

## 🔄 HYBRID APPROACH: HTTP + KAFKA

**Khuyến nghị:** Dùng **CẢ HAI** song song!

### HTTP REST (Synchronous) - Cho queries:
```typescript
// Read operations (cần response ngay)
GET /api/dating/profiles           → HTTP
GET /api/dating/matches            → HTTP
GET /api/dating/recommendations    → HTTP
```

### KAFKA (Asynchronous) - Cho commands:
```typescript
// Write operations (fire & forget)
POST /api/dating/swipe             → Kafka Event
POST /api/dating/profile           → Kafka Event
POST /api/payment/purchase         → Kafka Event
```

---

## 📦 PROJECT STRUCTURE

```
apps/
├── api-gateway/
│   ├── src/
│   │   ├── kafka/
│   │   │   ├── KafkaProducerModule.ts
│   │   │   └── KafkaProducerService.ts
│   │   └── main.ts
│   └── package.json
│
├── microservices/
│   ├── dating-service/
│   │   ├── src/
│   │   │   ├── infrastructure/
│   │   │   │   └── messaging/
│   │   │   │       ├── KafkaProducerService.ts
│   │   │   │       ├── KafkaConsumerService.ts
│   │   │   │       └── KafkaModule.ts
│   │   │   └── main.ts
│   │   └── package.json
│   │
│   └── property-service/
│       └── ... (tương tự)
│
infrastructure/
├── shared/
│   ├── events/
│   │   ├── DatingEvents.ts
│   │   ├── PropertyEvents.ts
│   │   ├── PaymentEvents.ts
│   │   └── UserEvents.ts
│   └── kafka/
│       └── KafkaConfig.ts
│
└── compose/
    ├── docker-compose.kafka.yml
    └── docker-compose.kafka.production.yml
```

---

## ✅ NEXT STEPS

1. **Phase 1: Setup Kafka Infrastructure**
   - [ ] Docker Compose cho development
   - [ ] Kafka UI cho monitoring
   - [ ] Test connectivity

2. **Phase 2: Implement Kafka in Dating Service**
   - [ ] KafkaProducerService
   - [ ] KafkaConsumerService
   - [ ] Update use cases
   - [ ] Define event schemas

3. **Phase 3: Implement Other Services**
   - [ ] Property Service
   - [ ] Payment Service
   - [ ] Message Service

4. **Phase 4: Production Deployment**
   - [ ] Multi-VPS Kafka cluster
   - [ ] Monitoring (Prometheus + Grafana)
   - [ ] Security (SSL/TLS, SASL)
   - [ ] Backup & disaster recovery

---

## 🎉 CONCLUSION

### Với Kafka, bạn có:
- ✅ **Scalability**: Millions of messages/second
- ✅ **Reliability**: Message persistence + replication
- ✅ **Flexibility**: Services trên nhiều VPS
- ✅ **Decoupling**: Services không cần biết nhau
- ✅ **Event History**: Replay events khi cần
- ✅ **Fan-out**: 1 event → N consumers

**Status:** ✅ **READY TO IMPLEMENT KAFKA!**

---

**Created by:** AI Assistant 🤖  
**Date:** October 9, 2025  
**For:** Trung Tâm Trợ Chơi - Distributed Microservices với Kafka

