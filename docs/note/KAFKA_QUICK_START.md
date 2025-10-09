# 🚀 KAFKA - QUICK START GUIDE

## 📦 Setup Kafka cho Development

### 1. Start Kafka với Docker Compose

```bash
# Start Kafka cluster
cd infrastructure/compose
docker-compose -f docker-compose.kafka.yml up -d

# Check status
docker ps | grep kafka

# View logs
docker logs kafka-1 -f
```

**Services running:**
- Zookeeper: `localhost:2181`
- Kafka Broker: `localhost:19092`
- Kafka UI: `http://localhost:8080`

---

### 2. Install Dependencies

```bash
cd apps/microservices/dating-service
npm install kafkajs
```

---

### 3. Configure Environment

```env
# apps/microservices/dating-service/.env
KAFKA_BROKERS=localhost:19092
KAFKA_CLIENT_ID=dating-service
KAFKA_GROUP_ID=dating-service-group
```

---

## 💻 Implement Kafka trong Dating Service

### 1. Update DatingModule

```typescript
// apps/microservices/dating-service/src/application/di/DatingModule.ts
import { KafkaProducerService } from '@infrastructure/messaging/KafkaProducerService';

@Module({
  providers: [
    // ... existing providers
    KafkaProducerService,
  ],
  exports: [KafkaProducerService],
})
export class DatingModule {}
```

---

### 2. Use trong Use Case

```typescript
// SwipeProfileUseCase.ts
export class SwipeProfileUseCase {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async execute(payload: SwipeProfileUseCasePayload) {
    // Business logic
    const swipe = await this.createSwipe(payload);
    
    // ✅ Publish event to Kafka
    await this.kafkaProducer.publishSwipePerformed(
      swipe.getId(),
      payload.customerId,
      payload.profileId,
      payload.targetId,
      payload.targetProfileId,
      payload.action,
    );
    
    return swipe;
  }
}
```

---

## 🧪 Testing Kafka

### 1. Kafka UI (Browser)

Open: `http://localhost:8080`

- View topics
- Monitor messages
- Check consumer groups

---

### 2. Send Test Event

```bash
# Using kafka-console-producer
docker exec -it kafka-1 kafka-console-producer \
  --bootstrap-server localhost:9092 \
  --topic dating.swipe.performed

# Type JSON and press Enter:
{"eventType":"dating.swipe.performed","data":{"swiperId":"user123","targetId":"user456"}}
```

---

### 3. Consume Test Event

```bash
# Using kafka-console-consumer
docker exec -it kafka-1 kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic dating.swipe.performed \
  --from-beginning
```

---

## 🎯 Common Topics

```
# Dating Service
dating.profile.created
dating.swipe.performed
dating.match.created
dating.subscription.created

# Property Service  
property.booking.requested
property.booking.confirmed

# Payment Service
payment.completed
payment.failed

# Cross-service
user.registered
notification.send
```

---

## 🔧 Production Setup (Multi-VPS)

### VPS 1: Zookeeper
```bash
docker run -d \
  --name zookeeper \
  -p 2181:2181 \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  confluentinc/cp-zookeeper:7.5.0
```

### VPS 2-4: Kafka Brokers
```bash
docker run -d \
  --name kafka-1 \
  -p 9092:9092 \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=vps1.example.com:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://vps2.example.com:9092 \
  confluentinc/cp-kafka:7.5.0
```

### VPS 5+: Microservices
```env
KAFKA_BROKERS=vps2.example.com:9092,vps3.example.com:9092,vps4.example.com:9092
```

---

## ✅ Checklist

- [ ] Kafka cluster running
- [ ] Kafka UI accessible
- [ ] KafkaProducerService created
- [ ] Events published successfully
- [ ] Monitoring setup (Kafka UI)

---

**Status:** ✅ Ready to use Kafka!

Xem chi tiết: `docs/note/KAFKA_ARCHITECTURE_PLAN.md`

