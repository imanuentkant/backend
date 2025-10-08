# 🏠 AIRBNB FEATURES ROADMAP

## 📊 PHÂN TÍCH HỆ THỐNG HIỆN TẠI

### Có sẵn:
- ✅ User (Author, Guest)
- ✅ Post (content publishing)
- ✅ Media (image upload)
- ✅ Comment
- ✅ Album
- ✅ Authentication & Authorization
- ✅ Clean Architecture foundation

### Cần bổ sung cho Airbnb:
- ❌ Property Listing (chỗ ở)
- ❌ Booking System
- ❌ Payment Processing
- ❌ Reviews & Ratings
- ❌ Search & Filters
- ❌ Calendar & Availability
- ❌ Messaging
- ❌ Pricing System

---

## 🎯 AIRBNB CORE FEATURES

### Phase 1: Property Management (Tuần 1-2)
**Entities:**
- Property (listing)
- PropertyType (apartment, house, villa, room)
- Amenity (WiFi, kitchen, pool, etc.)
- Location (address, coordinates)
- PropertyPhoto

**Use Cases:**
1. Host can create property listing
2. Host can add photos to property
3. Host can set amenities
4. Host can set pricing
5. Host can set availability
6. Host can edit property details
7. Host can activate/deactivate listing

### Phase 2: Search & Discovery (Tuần 3)
**Features:**
- Search by location
- Filter by price range
- Filter by property type
- Filter by amenities
- Filter by dates (availability)
- Sort by price, rating, distance
- Map view integration

**Technical:**
- Elasticsearch for search
- Geospatial queries
- Caching for popular searches
- Pagination

### Phase 3: Booking System (Tuần 4-5)
**Entities:**
- Booking
- BookingStatus (pending, confirmed, cancelled, completed)
- Payment
- PaymentStatus

**Use Cases:**
1. Guest can check availability
2. Guest can request booking
3. Host can accept/decline booking
4. Guest can cancel booking (with policy)
5. System calculates total price
6. System blocks dates after booking
7. Instant booking option

**Business Logic:**
- Pricing calculation (nights × price + fees)
- Cancellation policies (flexible, moderate, strict)
- Double booking prevention
- Auto-expire pending bookings

### Phase 4: Payment Integration (Tuần 6)
**Features:**
- Stripe integration
- PayPal integration
- Payment escrow (hold money)
- Payout to hosts
- Refund handling
- Multi-currency support

**Security:**
- PCI compliance
- Secure payment tokens
- Fraud detection

### Phase 5: Reviews & Ratings (Tuần 7)
**Entities:**
- Review (from guest to property)
- HostReview (from host to guest)
- Rating (overall, cleanliness, accuracy, etc.)

**Use Cases:**
1. Guest can review property after checkout
2. Host can review guest after checkout
3. Calculate average ratings
4. Display reviews with pagination
5. Flag inappropriate reviews

**Business Rules:**
- Can only review after completed stay
- Both parties review simultaneously
- Reviews published together
- 14 days window to leave review

### Phase 6: Messaging System (Tuần 8)
**Features:**
- Real-time chat (WebSocket)
- Message history
- Attachment support
- Automated messages
- Booking-related messages

**Technical:**
- Socket.io / WebSocket
- Message queue
- Read receipts
- Push notifications

### Phase 7: Calendar & Availability (Tuần 9)
**Features:**
- Calendar view (monthly/yearly)
- Block/unblock dates
- Import external calendars (iCal)
- Sync with other platforms
- Minimum/maximum stay rules

### Phase 8: Advanced Features (Tuần 10+)
- Dynamic pricing (smart pricing)
- Super host program
- Instant booking
- Experiences (activities)
- Multi-listing for hosts
- Wishlists for guests
- Travel insurance
- Identity verification
- Background checks

---

## 🏗️ DATABASE SCHEMA (New Tables)

### Properties
```sql
CREATE TABLE properties (
    id UUID PRIMARY KEY,
    host_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50), -- apartment, house, villa, room
    max_guests INT,
    bedrooms INT,
    beds INT,
    bathrooms DECIMAL(3,1),
    price_per_night DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    cleaning_fee DECIMAL(10,2),
    service_fee_percentage DECIMAL(5,2),
    minimum_nights INT DEFAULT 1,
    maximum_nights INT DEFAULT 365,
    instant_booking BOOLEAN DEFAULT false,
    status VARCHAR(20), -- draft, active, inactive
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE property_locations (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP
);

CREATE TABLE property_amenities (
    property_id UUID REFERENCES properties(id),
    amenity_id UUID REFERENCES amenities(id),
    PRIMARY KEY (property_id, amenity_id)
);

CREATE TABLE amenities (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    icon VARCHAR(50),
    category VARCHAR(50) -- basic, safety, entertainment
);

CREATE TABLE property_photos (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    media_id UUID REFERENCES media(id),
    is_cover BOOLEAN DEFAULT false,
    order_index INT,
    created_at TIMESTAMP
);
```

### Bookings
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    guest_id UUID REFERENCES users(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT,
    total_nights INT,
    price_per_night DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    cleaning_fee DECIMAL(10,2),
    service_fee DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(20), -- pending, confirmed, cancelled, completed, rejected
    cancellation_policy VARCHAR(20), -- flexible, moderate, strict
    special_requests TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP
);

CREATE TABLE booking_dates (
    property_id UUID REFERENCES properties(id),
    date DATE,
    booking_id UUID REFERENCES bookings(id),
    status VARCHAR(20), -- booked, blocked
    PRIMARY KEY (property_id, date)
);
```

### Reviews
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    property_id UUID REFERENCES properties(id),
    reviewer_id UUID REFERENCES users(id), -- guest
    reviewee_id UUID REFERENCES users(id), -- host
    rating_overall DECIMAL(2,1),
    rating_cleanliness DECIMAL(2,1),
    rating_accuracy DECIMAL(2,1),
    rating_checkin DECIMAL(2,1),
    rating_communication DECIMAL(2,1),
    rating_location DECIMAL(2,1),
    rating_value DECIMAL(2,1),
    comment TEXT,
    response TEXT, -- host response
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP,
    published_at TIMESTAMP
);
```

### Messages
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    property_id UUID REFERENCES properties(id),
    booking_id UUID REFERENCES bookings(id),
    guest_id UUID REFERENCES users(id),
    host_id UUID REFERENCES users(id),
    last_message_at TIMESTAMP,
    created_at TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),
    content TEXT,
    attachment_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP
);
```

### Payments
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    payer_id UUID REFERENCES users(id),
    payee_id UUID REFERENCES users(id),
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    payment_method VARCHAR(50), -- stripe, paypal
    transaction_id VARCHAR(255),
    status VARCHAR(20), -- pending, completed, failed, refunded
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

---

## 🔌 API ENDPOINTS

### Properties
```
POST   /api/properties              # Create listing
GET    /api/properties              # List all properties (public)
GET    /api/properties/:id          # Get property details
PUT    /api/properties/:id          # Update property
DELETE /api/properties/:id          # Delete property
POST   /api/properties/:id/photos   # Add photos
GET    /api/properties/:id/calendar # Get availability
PUT    /api/properties/:id/calendar # Update availability

# Host's properties
GET    /api/host/properties         # List host's properties
GET    /api/host/properties/:id     # Get host's property
```

### Search
```
GET    /api/search                  # Search properties
POST   /api/search/filters          # Advanced search with filters
GET    /api/search/suggestions      # Location suggestions
```

### Bookings
```
POST   /api/bookings                # Create booking
GET    /api/bookings                # List user's bookings
GET    /api/bookings/:id            # Get booking details
PUT    /api/bookings/:id/confirm    # Confirm booking (host)
PUT    /api/bookings/:id/cancel     # Cancel booking
PUT    /api/bookings/:id/complete   # Complete booking

# Price calculation
POST   /api/bookings/calculate-price  # Calculate booking price
GET    /api/properties/:id/availability  # Check availability
```

### Reviews
```
POST   /api/reviews                 # Create review
GET    /api/reviews                 # List reviews
GET    /api/properties/:id/reviews  # Property reviews
GET    /api/users/:id/reviews       # User reviews (as guest/host)
PUT    /api/reviews/:id/response    # Host responds to review
```

### Messages
```
GET    /api/conversations           # List conversations
GET    /api/conversations/:id       # Get conversation
POST   /api/conversations           # Start conversation
POST   /api/messages                # Send message
PUT    /api/messages/:id/read       # Mark as read
```

### Payments
```
POST   /api/payments/intent         # Create payment intent
POST   /api/payments/confirm        # Confirm payment
GET    /api/payments/:id            # Get payment details
POST   /api/payments/:id/refund     # Refund payment
```

---

## 🎨 FRONTEND FEATURES (for reference)

### Guest Flow
1. **Home Page**: Search bar, featured properties
2. **Search Results**: Map view, list view, filters
3. **Property Details**: Photos, amenities, reviews, calendar
4. **Booking**: Date selection, guest count, price breakdown
5. **Checkout**: Payment, special requests
6. **Trips**: Upcoming, past bookings
7. **Messages**: Chat with hosts
8. **Profile**: Reviews received, wishlist

### Host Flow
1. **Dashboard**: Earnings, bookings, occupancy rate
2. **Listings**: Manage properties
3. **Calendar**: Availability management
4. **Reservations**: Booking requests, confirmations
5. **Messages**: Chat with guests
6. **Earnings**: Payouts, transaction history
7. **Reviews**: Reviews received, respond

---

## 🚀 IMPLEMENTATION PRIORITY

### MVP (Minimum Viable Product) - 4 tuần
1. ✅ Property listing creation
2. ✅ Search & filters (basic)
3. ✅ Booking system
4. ✅ Payment integration (Stripe)
5. ✅ Basic reviews

### V2 - 2 tuần
6. ✅ Messaging system
7. ✅ Calendar management
8. ✅ Host dashboard
9. ✅ Guest dashboard

### V3 - 2 tuần
10. ✅ Advanced search (Elasticsearch)
11. ✅ Dynamic pricing
12. ✅ Multi-currency
13. ✅ Email notifications

### V4 - 2 tuần
14. ✅ Super host program
15. ✅ Instant booking
16. ✅ Wishlists
17. ✅ Identity verification

---

## 💰 MONETIZATION

### Revenue Streams
1. **Service Fee**: 3-5% from guests
2. **Host Fee**: 3% from hosts
3. **Cleaning Fee**: Pass-through
4. **Experience Booking**: 20% commission
5. **Premium Listing**: Featured placement
6. **Insurance**: Optional coverage

### Pricing Model
```
Total Price = (Nights × Price per Night) + Cleaning Fee + Service Fee
Service Fee = Subtotal × 0.14 (typically 14%)
```

---

## 🔒 SECURITY & COMPLIANCE

### Must-Have
- ✅ PCI DSS compliance (for payments)
- ✅ GDPR compliance (data protection)
- ✅ KYC/AML (identity verification)
- ✅ Background checks
- ✅ Property insurance
- ✅ Liability insurance
- ✅ Fraud detection
- ✅ Secure messaging
- ✅ Content moderation

---

## 📊 METRICS TO TRACK

### Business Metrics
- Booking rate (%)
- Occupancy rate (%)
- Average booking value (ABV)
- Revenue per available room (RevPAR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Host retention rate
- Guest retention rate

### Technical Metrics
- Search latency (< 500ms)
- Booking success rate (> 95%)
- Payment success rate (> 98%)
- API response time (< 200ms)
- Error rate (< 0.1%)
- Uptime (> 99.9%)

---

## 🛠️ TECH STACK ADDITIONS

### Backend
- **Search**: Elasticsearch
- **Real-time**: Socket.io / Redis Pub/Sub
- **Payment**: Stripe SDK
- **Email**: SendGrid / AWS SES
- **SMS**: Twilio
- **Background Jobs**: BullMQ (already have)
- **Geospatial**: PostGIS extension

### Frontend (suggestion)
- **Framework**: Next.js / React
- **State**: Redux / Zustand
- **Maps**: Google Maps / Mapbox
- **Calendar**: react-dates (Airbnb's library)
- **Charts**: Chart.js / Recharts

---

## 📝 NEXT ACTIONS

### Bắt đầu ngay:
1. ✅ Tạo domain models (Property, Booking, Review)
2. ✅ Tạo database migrations
3. ✅ Implement Property CRUD
4. ✅ Implement Search API
5. ✅ Implement Booking system
6. ✅ Integrate Stripe
7. ✅ Implement Reviews

### Bạn muốn bắt đầu với phần nào?
A. Property Management (listings, photos, amenities)
B. Search & Filters (tìm kiếm chỗ ở)
C. Booking System (đặt phòng)
D. Tất cả cùng lúc (full implementation)

---

**Recommendation**: Bắt đầu với **A. Property Management** vì đây là nền tảng cho tất cả features khác.

