# 🚗 Vehicle Rental System - Quick Start Guide

## ✅ Đã Hoàn Thành

Hệ thống **Vehicle Rental** đã được tích hợp vào backend với:
- ✅ Domain entities & value objects
- ✅ Use cases & business logic
- ✅ Repository adapters
- ✅ API controllers & DTOs
- ✅ Database migrations
- ✅ DI modules configuration

## 🚀 Chạy Hệ Thống

### 1. Run Migrations

```bash
# Chạy tất cả migrations (bao gồm vehicles table)
npm run migration:run

# hoặc sử dụng TypeORM CLI
npx typeorm migration:run
```

### 2. Start Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### 3. Access API Documentation

Mở browser: `http://localhost:3005/documentation`

---

## 📡 API Endpoints

### Vehicle Management

#### 1. Create Vehicle (Owner only)
```http
POST /api/vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Toyota Camry 2022 - Sedan sang trọng",
  "description": "Xe sedan 5 chỗ, động cơ hybrid, tiết kiệm nhiên liệu. Xe mới, bảo dưỡng định kỳ.",
  "vehicleType": "car",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2022,
  "licensePlate": "51A-12345",
  "color": "Đen",
  "seats": 5,
  "transmissionType": "automatic",
  "fuelType": "hybrid",
  "condition": "excellent",
  "mileage": 15000,
  "pricePerDay": 80,
  "pricePerHour": 12,
  "currency": "USD",
  "securityDeposit": 200,
  "insuranceFee": 10,
  "location": "Ho Chi Minh City, District 1",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "features": ["GPS", "Bluetooth", "Air Conditioning", "Backup Camera", "USB Charging"]
}
```

**Response 201:**
```json
{
  "id": "01932b5a-...",
  "title": "Toyota Camry 2022 - Sedan sang trọng",
  "vehicleType": "car",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2022,
  "pricing": {
    "pricePerDay": 80,
    "pricePerHour": 12,
    "currency": "USD",
    "securityDeposit": 200,
    "insuranceFee": 10
  },
  "status": "available",
  "createdAt": "2025-10-08T..."
}
```

---

#### 2. Search Vehicles (Public)
```http
GET /api/vehicles?vehicleType=car&location=HCM&seats=4&minPrice=50&maxPrice=200&page=1&limit=10
```

**Query Parameters:**
- `vehicleType` (optional): car, motorcycle, bicycle, truck, van, bus, boat, jet_ski
- `location` (optional): Địa điểm (text search)
- `startDate` (optional): Ngày bắt đầu thuê (YYYY-MM-DD)
- `endDate` (optional): Ngày trả xe (YYYY-MM-DD)
- `minPrice` (optional): Giá tối thiểu mỗi ngày
- `maxPrice` (optional): Giá tối đa mỗi ngày
- `seats` (optional): Số chỗ ngồi tối thiểu
- `page` (optional): Trang (default: 1)
- `limit` (optional): Số items mỗi trang (default: 10)

**Response 200:**
```json
{
  "data": [
    {
      "id": "01932b5a-...",
      "title": "Toyota Camry 2022",
      "vehicleType": "car",
      "brand": "Toyota",
      "model": "Camry",
      "year": 2022,
      "seats": 5,
      "transmissionType": "automatic",
      "fuelType": "hybrid",
      "pricePerDay": 80,
      "location": "Ho Chi Minh City",
      "status": "available",
      "features": ["GPS", "Bluetooth", "AC"]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

#### 3. Get Vehicle Details (Public)
```http
GET /api/vehicles/01932b5a-...
```

**Response 200:**
```json
{
  "id": "01932b5a-...",
  "ownerId": "01932456-...",
  "title": "Toyota Camry 2022 - Sedan sang trọng",
  "description": "Xe sedan 5 chỗ...",
  "vehicleType": "car",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2022,
  "licensePlate": "51A-12345",
  "color": "Đen",
  "seats": 5,
  "transmissionType": "automatic",
  "fuelType": "hybrid",
  "condition": "excellent",
  "mileage": 15000,
  "pricing": {
    "pricePerDay": 80,
    "pricePerHour": 12,
    "currency": "USD",
    "securityDeposit": 200,
    "insuranceFee": 10
  },
  "location": "Ho Chi Minh City, District 1",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "status": "available",
  "instantBooking": false,
  "features": ["GPS", "Bluetooth", "Air Conditioning"],
  "samplePricing": {
    "days": 3,
    "breakdown": {
      "basePrice": 80,
      "unitPrice": 80,
      "units": 3,
      "subtotal": 240,
      "additionalFees": [
        {
          "name": "Insurance",
          "amount": 30,
          "type": "fixed"
        },
        {
          "name": "Security Deposit",
          "amount": 200,
          "type": "fixed"
        },
        {
          "name": "Service Fee",
          "amount": 24,
          "type": "percentage"
        }
      ],
      "taxAmount": 19.52,
      "totalAmount": 513.52,
      "currency": "USD"
    }
  },
  "createdAt": "2025-10-08T...",
  "updatedAt": "2025-10-08T..."
}
```

---

#### 4. Calculate Rental Price (Public)
```http
POST /api/vehicles/calculate-price
Content-Type: application/json

{
  "vehicleId": "01932b5a-...",
  "startDate": "2025-11-01",
  "endDate": "2025-11-05",
  "useHourly": false
}
```

**Response 200:**
```json
{
  "vehicleId": "01932b5a-...",
  "startDate": "2025-11-01",
  "endDate": "2025-11-05",
  "pricing": {
    "basePrice": 80,
    "unitPrice": 80,
    "units": 4,
    "subtotal": 320,
    "additionalFees": [
      {
        "name": "Insurance",
        "amount": 40,
        "type": "fixed",
        "description": "Insurance coverage for 4 days"
      },
      {
        "name": "Security Deposit",
        "amount": 200,
        "type": "fixed",
        "description": "Refundable security deposit"
      },
      {
        "name": "Service Fee",
        "amount": 32,
        "type": "percentage",
        "description": "10% platform service fee"
      }
    ],
    "taxAmount": 25.92,
    "totalAmount": 617.92,
    "currency": "USD"
  },
  "breakdown": [
    {
      "label": "80 USD × 4 days",
      "amount": 320
    },
    {
      "label": "Insurance",
      "amount": 40,
      "description": "Insurance coverage for 4 days"
    },
    {
      "label": "Security Deposit",
      "amount": 200,
      "description": "Refundable security deposit"
    },
    {
      "label": "Service Fee",
      "amount": 32,
      "description": "10% platform service fee"
    },
    {
      "label": "Tax (8%)",
      "amount": 25.92
    }
  ],
  "total": 617.92,
  "currency": "USD"
}
```

---

#### 5. Get Owner's Vehicles (Owner only)
```http
GET /api/vehicles/owner/my-vehicles
Authorization: Bearer <token>
```

---

## 🎯 Booking a Vehicle

Để book một vehicle, sử dụng Booking API với `bookableType` là `"vehicle"`:

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookableType": "vehicle",
  "bookableId": "01932b5a-...",
  "checkInDate": "2025-11-01",
  "checkOutDate": "2025-11-05",
  "numberOfGuests": 2,
  "specialRequests": "Cần xe sạch sẽ, có đầy xăng"
}
```

**Note:** Backend sẽ tự động tính giá dựa trên vehicle pricing và thời gian thuê.

---

## 🧪 Testing với Postman/Thunder Client

### Collection Setup

1. **Create Environment:**
```json
{
  "baseUrl": "http://localhost:3005",
  "token": "Bearer eyJhbGc..."
}
```

2. **Import Requests:**
- Create Vehicle
- Search Vehicles
- Get Vehicle Details
- Calculate Price
- Book Vehicle

### Test Flow

1. **Đăng ký/Đăng nhập** → Lấy JWT token
2. **Create Vehicle** → Owner tạo vehicle listing
3. **Search Vehicles** → Tìm xe phù hợp
4. **Calculate Price** → Tính giá thuê
5. **Book Vehicle** → Đặt xe

---

## 📊 Vehicle Types Supported

| Type | Code | Description |
|------|------|-------------|
| 🚗 Car | `car` | Ô tô con 4-7 chỗ |
| 🏍️ Motorcycle | `motorcycle` | Xe máy, xe mô tô |
| 🚲 Bicycle | `bicycle` | Xe đạp |
| 🚚 Truck | `truck` | Xe tải, xe pickup |
| 🚐 Van | `van` | Xe van, xe du lịch |
| 🚌 Bus | `bus` | Xe bus, xe khách |
| ⛵ Boat | `boat` | Thuyền, ca-nô |
| 🛥️ Jet Ski | `jet_ski` | Mô tô nước |

---

## 💡 Business Logic

### Pricing Calculation

```typescript
// Daily rental (4 days)
Subtotal = pricePerDay × days = 80 × 4 = 320 USD
Insurance = insuranceFee × days = 10 × 4 = 40 USD
Service Fee = subtotal × 10% = 320 × 0.1 = 32 USD
Security Deposit = 200 USD (refundable)
Tax = (subtotal + fees - deposit) × 8% = 25.92 USD

Total = 617.92 USD
```

### Availability Check

- Check vehicle status = `"available"`
- Check against existing bookings (TODO: implement)
- Check maintenance schedule (TODO: implement)

---

## 🔒 Authorization

### Public Endpoints (No Auth Required)
- `GET /api/vehicles` - Search
- `GET /api/vehicles/:id` - Details
- `POST /api/vehicles/calculate-price` - Calculate

### Protected Endpoints (Auth Required)
- `POST /api/vehicles` - Create (Owner)
- `GET /api/vehicles/owner/my-vehicles` - My vehicles
- All booking endpoints

---

## 🎉 Success Criteria

✅ Migrations run successfully  
✅ Server starts without errors  
✅ API documentation loads  
✅ Can create vehicle listing  
✅ Can search vehicles  
✅ Can calculate price  
✅ Can book vehicle  

---

## 📝 Next Steps

1. **Add Photos:** Upload vehicle photos
2. **Reviews:** Vehicle review system
3. **Calendar:** Availability calendar
4. **Maps:** Integrate Google Maps
5. **Messaging:** Owner-Renter chat
6. **Insurance:** Third-party insurance integration

---

## 🐛 Troubleshooting

### Migration Fails
```bash
# Reset database
npm run migration:revert
npm run migration:run
```

### Port Already in Use
```bash
# Change port in .env
API_PORT=3006
```

### TypeORM Connection Error
- Check database credentials in `.env`
- Ensure PostgreSQL is running
- Check `ormconfig.json`

---

## 📞 Support

Hệ thống đã sẵn sàng! Bắt đầu test ngay thôi! 🚀

- Swagger UI: `http://localhost:3005/documentation`
- Health Check: `http://localhost:3005/health`

