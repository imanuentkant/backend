# 🏠 Property Service

Microservice quản lý **Properties/Airbnb** trong hệ thống Trung Tâm Trợ Chơi.

## 📊 Features

- ✅ Property CRUD (Create, Read, Update, Delete)
- ✅ Property Search & Filters
- ✅ Availability Calendar
- ✅ Photos Management
- ✅ Amenities
- ✅ Reviews & Ratings
- ✅ Wishlist
- ✅ Booking Integration
- ✅ Kafka Events

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start in development
npm run start:dev

# Build for production
npm run build
npm start
```

## ⚙️ Environment Variables

```env
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/property_db
KAFKA_BROKERS=localhost:19092
```

## 📖 API Endpoints

### Properties
- `POST /api/properties` - Create property
- `GET /api/properties` - List properties (with filters)
- `GET /api/properties/:id` - Get property detail
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Search
- `GET /api/properties/search` - Search properties (location, dates, guests, price)

### Calendar
- `GET /api/properties/:id/calendar` - Get availability
- `PUT /api/properties/:id/calendar` - Update availability

### Reviews
- `GET /api/properties/:id/reviews` - Get property reviews
- `POST /api/properties/:id/reviews` - Create review

## 🎯 Architecture

```
src/
├── core/
│   ├── domain/
│   │   └── property/
│   │       ├── entity/
│   │       └── port/
│   └── service/
│       └── property/
│           └── usecase/
├── application/
│   ├── controller/
│   ├── dto/
│   └── di/
└── infrastructure/
    ├── persistence/
    │   └── typeorm/
    └── messaging/
        └── KafkaProducerService.ts
```

## 📡 Kafka Events

### Produced Events:
- `property.created`
- `property.updated`
- `property.deleted`
- `property.availability.changed`
- `property.booking.requested`

### Consumed Events:
- `booking.confirmed` → Update availability
- `payment.completed` → Confirm booking
- `review.created` → Update rating

## 🏢 Multi-VPS Ready

Service này được thiết kế để chạy độc lập trên VPS riêng:

```bash
# VPS 6: Property Service
docker run -d \
  --name property-service \
  -p 3002:3002 \
  -e KAFKA_BROKERS=vps2.com:9092,vps3.com:9092 \
  -e DATABASE_URL=postgresql://... \
  property-service:latest
```

## ✅ Status

🎉 **READY FOR PRODUCTION**

- [x] Core entities
- [x] Use cases
- [x] REST API
- [x] Kafka integration
- [x] Authentication
- [x] Database migrations
- [x] Documentation

