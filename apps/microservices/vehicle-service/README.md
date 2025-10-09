# 🚗 Vehicle Service

Microservice for vehicle rental management.

## Features

- ✅ Vehicle CRUD operations
- ✅ Vehicle search & filters
- ✅ Availability management
- ✅ Booking system
- ✅ Owner dashboard
- ✅ Kafka events integration

## API Endpoints

### Vehicles
- `GET /vehicles` - List vehicles
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - Create vehicle
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

### Booking
- `POST /vehicles/:id/book` - Book vehicle
- `GET /bookings` - Get user bookings
- `PUT /bookings/:id/cancel` - Cancel booking

## Quick Start

```bash
npm install
npm run start:dev
```

## Environment

```env
PORT=3003
DB_HOST=localhost
DB_DATABASE=vehicle_db
KAFKA_BROKERS=localhost:19092
```

## Docker

```bash
docker build -t vehicle-service .
docker run -p 3003:3003 vehicle-service
```

**Status:** ✅ Ready for production

