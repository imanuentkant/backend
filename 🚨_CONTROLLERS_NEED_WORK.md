# 🚨 Controllers Cần Làm Việc

## 📊 Tổng Quan

**6/9 controllers** đã hoàn chỉnh ✅  
**3/9 controllers** cần refactor ⚠️

---

## ✅ CONTROLLERS HOÀN CHỈNH

### 1. BookingController ✅
- 7 endpoints
- 0% mock data
- Use cases đầy đủ
- Full type safety

### 2. PropertyController ✅
- 10 endpoints
- 0% mock data
- Use cases đầy đủ
- Full type safety

### 3. VehicleController ✅
- 5 endpoints
- 0% mock data
- Use cases đầy đủ
- Full type safety

### 4. ReviewController ✅
- 4 endpoints
- 0% mock data
- Use cases đầy đủ
- Full type safety

### 5. MessageController ✅
- 6 endpoints
- 0% mock data (có TODO fetch details)
- Use cases đầy đủ
- Full type safety

### 6. HostDashboardController ✅
- 5 endpoints
- 0% mock data
- Use cases đầy đủ
- Full type safety

---

## ⚠️ CONTROLLERS CẦN REFACTOR

### 1. PropertyPhotoController ⚠️
**Status:** 50% mock data

#### Vi Phạm:
```typescript
// ❌ Business logic trong controller
async uploadPhoto(...) {
  const photoId = UuidGenerator.generate();      // Logic
  const filename = `properties/${propertyId}/`; // Logic
  await this.fileStorage.upload({...});         // Direct call
  // TODO: Save to database                     // Chưa implement
  return { ... };
}

// ❌ Mock data
async getPhotos(...) {
  return {
    data: [
      { id: UuidGenerator.generate(), ... }  // Mock!
    ]
  };
}
```

#### Cần Tạo:
```typescript
// Domain
class PropertyPhoto extends Entity {
  - propertyId: string
  - mediaId: string
  - url: string
  - isCover: boolean
  - orderIndex: number
  - caption?: string
}

// Use Cases
- UploadPropertyPhotoUseCase
- ListPropertyPhotosUseCase
- UpdatePropertyPhotoUseCase
- DeletePropertyPhotoUseCase
- ReorderPropertyPhotosUseCase
- SetCoverPhotoUseCase

// Repository
- PropertyPhotoRepositoryPort
- PropertyPhotoRepositoryAdapter
```

**Mức Độ:** 🔴 Cao - Controller có business logic

---

### 2. PropertyCalendarController ⚠️
**Status:** 100% mock data + business logic

#### Vi Phạm:
```typescript
// ❌ Business logic trong controller
async getCalendar(...) {
  // Generate mock calendar
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const basePrice = 100;
    const price = isWeekend ? basePrice * 1.5 : basePrice;  // Pricing logic!
    const isBooked = Math.random() < 0.3;                   // Mock!
    // ...
  }
}

// ❌ Mock calculations
async getPricingCalendar(...) {
  const isHighSeason = [5, 6, 7, 11].includes(date.getMonth());  // Logic!
  const avgPrice = isHighSeason ? basePrice * 1.3 : basePrice;   // Logic!
  // ...
}
```

#### Cần Tạo:
```typescript
// Domain
class PropertyCalendar extends Entity {
  - propertyId: string
  - date: Date
  - pricePerNight: number
  - isAvailable: boolean
  - minimumNights: number
  - bookingId?: string
}

class AvailabilityRules extends Entity {
  - propertyId: string
  - advanceNoticeDays: number
  - preparationDays: number
  - checkInDays: number[]
  - checkInTimeFrom: string
  - checkInTimeTo: string
  - checkOutTime: string
}

// Use Cases
- GetPropertyCalendarUseCase
- UpdateDatePricingUseCase
- BulkUpdatePricingUseCase
- BlockDatesUseCase
- UnblockDatesUseCase
- GetAvailabilityRulesUseCase
- UpdateAvailabilityRulesUseCase
- SyncICalendarUseCase

// Repository
- PropertyCalendarRepositoryPort
```

**Mức Độ:** 🔴 Cao - Nhiều business logic trong controller

---

### 3. PaymentController ⚠️
**Status:** 50% mock data

#### Vi Phạm:
```typescript
// ❌ Mock data
async getPayment(...) {
  return {
    id,
    bookingId: UuidGenerator.generate(),  // Mock!
    amount: 476.00,                        // Mock!
    // ...
  };
}

// ❌ Mock data
async getTransactionHistory(...) {
  return {
    data: [
      { id: UuidGenerator.generate(), ... }  // Mock!
    ]
  };
}

// ❌ Mock data
async getHostPayouts(...) {
  return {
    data: [...]  // Mock!
  };
}
```

#### Cần Tạo:
```typescript
// Domain entity đã có
✅ core/domain/payment/entity/Payment.ts

// Use Cases cần tạo
- CreatePaymentUseCase
- GetPaymentUseCase
- ListUserPaymentsUseCase
- CreateRefundUseCase
- ListHostPayoutsUseCase

// Repository
- PaymentRepositoryPort
- PaymentRepositoryAdapter
```

**Mức Độ:** 🟡 Trung bình - Có Stripe integration, thiếu database

---

### 4. WishlistController ⚠️
**Status:** 100% mock data

#### Vi Phạm:
```typescript
// ❌ Toàn mock, không có logic thật
async addToWishlist(...) {
  return {
    id: UuidGenerator.generate(),  // Mock!
    message: '...'
  };
}

async getWishlist(...) {
  return {
    data: [...]  // Mock data!
  };
}
```

#### Cần Tạo:
```typescript
// Domain
class Wishlist extends Entity {
  - userId: string
  - bookableType: BookableItemType
  - bookableId: string
  - propertyId?: string  // Backward compatibility
  - addedAt: Date
}

// Use Cases
- AddToWishlistUseCase
- RemoveFromWishlistUseCase
- GetUserWishlistUseCase
- CheckInWishlistUseCase

// Repository
- WishlistRepositoryPort
- WishlistRepositoryAdapter
```

**Mức Độ:** 🟢 Thấp - Feature đơn giản

---

## 📊 PRIORITY MATRIX

### 🔴 Critical (Làm ngay)
```
1. PropertyCalendarController
   - Nhiều business logic trong controller
   - Quan trọng cho booking system
   - Cần 8 use cases

2. PropertyPhotoController
   - Business logic trong controller
   - Quan trọng cho property listing
   - Cần 6 use cases
```

### 🟡 Important (Làm sau)
```
3. PaymentController
   - Có Stripe integration
   - Thiếu database persistence
   - Cần 5 use cases
```

### 🟢 Nice-to-have (Optional)
```
4. WishlistController
   - Feature không critical
   - Đơn giản
   - Cần 4 use cases
```

---

## 🎯 GIẢI PHÁP ĐỀ XUẤT

### Option 1: Fix Từng Bước ✅ (Recommend)

#### Step 1: PropertyCalendarController
```
1. Tạo domain entities (PropertyCalendar, AvailabilityRules)
2. Tạo 8 use cases
3. Tạo repository port & adapter
4. Refactor controller
5. Test
```

#### Step 2: PropertyPhotoController
```
1. Domain entity PropertyPhoto đã có
2. Tạo 6 use cases
3. Tạo repository port & adapter
4. Refactor controller
5. Test
```

#### Step 3: PaymentController
```
1. Domain entity Payment đã có
2. Tạo 5 use cases
3. Tạo repository port & adapter
4. Refactor controller
5. Test
```

#### Step 4: WishlistController (Optional)
```
1. Tạo domain entity
2. Tạo 4 use cases
3. Tạo repository port & adapter
4. Refactor controller
5. Test
```

---

### Option 2: Chấp Nhận Hiện Trạng ⏸️

**Chấp nhận mock data cho:**
- PropertyPhotoController
- PropertyCalendarController
- PaymentController (partial)
- WishlistController

**Lý do:**
- Code đang hoạt động
- Features không critical
- Focus vào testing

**Note trong code:**
```typescript
// TODO: Implement real database integration
// Current: Mock data for demo purposes
```

---

## 📝 ESTIMATION

### Nếu Làm Đầy Đủ:

#### PropertyCalendarController
```
Domain:          2 entities × 30 mins    = 1 hour
Use Cases:       8 use cases × 20 mins   = 2.5 hours
Infrastructure:  Repository + Mapper     = 1 hour
Migration:       1 file                  = 30 mins
Controller:      Refactor                = 1 hour
Testing:         E2E tests               = 1 hour
────────────────────────────────────────────────
Total:                                    7 hours
```

#### PropertyPhotoController
```
Use Cases:       6 use cases             = 2 hours
Infrastructure:  Repository              = 1 hour
Controller:      Refactor                = 30 mins
Testing:         E2E tests               = 30 mins
────────────────────────────────────────────────
Total:                                    4 hours
```

#### PaymentController
```
Use Cases:       5 use cases             = 2 hours
Infrastructure:  Repository              = 1 hour
Migration:       Update migration        = 30 mins
Controller:      Refactor                = 30 mins
Testing:         E2E tests               = 1 hour
────────────────────────────────────────────────
Total:                                    5 hours
```

#### WishlistController
```
Domain:          1 entity                = 30 mins
Use Cases:       4 use cases             = 1.5 hours
Infrastructure:  Repository + Migration  = 1.5 hours
Controller:      Refactor                = 30 mins
Testing:         E2E tests               = 30 mins
────────────────────────────────────────────────
Total:                                    4.5 hours
```

**TOTAL: ~20 hours work**

---

## 🎯 RECOMMENDATION

### Đề Xuất Của Tôi:

**Làm theo thứ tự:**
1. ✅ Chấp nhận legacy modules (User, Post, Media, Album, Comment)
2. 🔧 Fix PropertyCalendarController (quan trọng nhất)
3. 🔧 Fix PropertyPhotoController (quan trọng thứ 2)
4. ⏸️ PaymentController - Document TODO, làm sau
5. ⏸️ WishlistController - Document TODO, làm sau

**Lý do:**
- Calendar & Photos quan trọng cho property booking
- Payment & Wishlist có thể làm sau
- Focus vào core features trước

---

Bạn muốn:
1. **Làm hết 4 controllers** (~20 hours)?
2. **Chỉ làm Calendar + Photo** (~11 hours)?
3. **Chấp nhận hiện trạng, chỉ document**?
4. **Làm từng bước, tôi chọn controller nào trước**?

Cho tôi biết nhé! 🚀
