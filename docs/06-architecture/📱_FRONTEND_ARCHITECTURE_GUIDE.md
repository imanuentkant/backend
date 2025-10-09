# 📱 FRONTEND ARCHITECTURE GUIDE

## 🎯 TỔNG QUAN

Backend đã hoàn chỉnh với **66 endpoints** production-ready. Giờ cần **2 Frontend Applications:**

1. **Client App** - Dành cho Guests (đặt phòng, xe, review)
2. **Admin/Host App** - Dành cho Hosts và Admins (quản lý properties, bookings)

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (DONE ✅)                        │
│   NestJS + TypeORM + PostgreSQL + MinIO + Stripe            │
│              66 RESTful APIs + WebSocket                     │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌──────────────────────────────┬──────────────────────────────┐
│     CLIENT FRONTEND          │    ADMIN/HOST FRONTEND       │
│   (Guest Experience)         │   (Host Management)          │
│                             │                              │
│  - Browse properties/vehicles│  - Property management       │
│  - Make bookings            │  - Booking management        │
│  - Reviews                  │  - Calendar & pricing        │
│  - Messaging                │  - Dashboard & analytics     │
│  - Wishlist                 │  - Photo management          │
│  - Payments                 │  - Review management         │
│                             │  - Payout tracking           │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 🎨 CLIENT FRONTEND (Guest App)

### Tech Stack Recommendation:
```
Framework: Next.js 14 (React)
Language: TypeScript
Styling: Tailwind CSS + Shadcn/ui
State: Zustand / React Query
Real-time: Socket.io-client
Maps: Google Maps / Mapbox
Payment: Stripe Elements
```

### Core Features:

#### 1. **Home & Search** (Public)
**APIs Used:**
- `GET /api/properties` - Search properties with filters
- `GET /api/vehicles` - Search vehicles

**Features:**
- Hero search bar (location, dates, guests)
- Property/vehicle cards grid
- Filters (price, type, amenities)
- Map view
- Sort options

#### 2. **Property/Vehicle Details** (Public)
**APIs Used:**
- `GET /api/properties/:id` - Get property details
- `GET /api/vehicles/:id` - Get vehicle details
- `GET /api/reviews/property/:propertyId` - Get reviews
- `GET /api/properties/:id/calendar` - Check availability
- `POST /api/bookings/calculate-price` - Price calculation

**Features:**
- Photo gallery
- Description & amenities
- Host info
- Calendar availability
- Price calculator
- Reviews section
- Similar listings

#### 3. **Booking Flow** (Authenticated)
**APIs Used:**
- `POST /api/bookings` - Create booking
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/:intentId/confirm` - Confirm payment
- `GET /api/bookings/:id` - Get booking details

**Features:**
- Booking form (dates, guests)
- Price breakdown
- Payment form (Stripe)
- Booking confirmation

#### 4. **User Dashboard** (Authenticated)
**APIs Used:**
- `GET /api/bookings/user` - Get user bookings
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/wishlists` - Get wishlist
- `GET /api/messages` - Get conversations
- `GET /api/payments/user/transactions` - Transaction history

**Features:**
- Upcoming trips
- Past trips
- Reviews written
- Wishlist
- Messages
- Payment history

#### 5. **Reviews** (Authenticated)
**APIs Used:**
- `GET /api/reviews/booking/:bookingId/can-review` - Check eligibility
- `POST /api/reviews` - Create review

**Features:**
- Review form (ratings, comment)
- Photo upload
- Review timeline

#### 6. **Messaging** (Authenticated + WebSocket)
**APIs Used:**
- `GET /api/messages` - Get conversations
- `GET /api/messages/:id` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id/read` - Mark as read
- WebSocket: `/chat` namespace

**Features:**
- Conversation list
- Real-time chat
- Message notifications
- Unread badges

#### 7. **Wishlist** (Authenticated)
**APIs Used:**
- `GET /api/wishlists` - Get wishlist
- `POST /api/wishlists/properties/:id` - Add to wishlist
- `DELETE /api/wishlists/properties/:id` - Remove from wishlist
- `GET /api/wishlists/properties/:id/check` - Check status

**Features:**
- Saved properties
- Quick add/remove
- Heart icon on cards

---

## 👨‍💼 ADMIN/HOST FRONTEND (Host Dashboard)

### Tech Stack Recommendation:
```
Framework: Next.js 14 (React) or Vue 3 + Nuxt
Language: TypeScript
UI Library: Ant Design / Material UI / Shadcn
Charts: Recharts / Chart.js
State: Redux Toolkit / Pinia
Real-time: Socket.io-client
```

### Core Features:

#### 1. **Dashboard Overview** (Host)
**APIs Used:**
- `GET /api/host/dashboard` - Dashboard overview
- `GET /api/host/dashboard/earnings` - Earnings report
- `GET /api/host/dashboard/occupancy` - Occupancy stats
- `GET /api/host/dashboard/performance` - Performance metrics
- `GET /api/host/dashboard/projection` - Revenue projection

**Features:**
- Total earnings card
- Occupancy rate chart
- Recent bookings list
- Performance metrics
- Revenue projection graph
- Quick stats (views, bookings, reviews)

#### 2. **Property Management** (Host)
**APIs Used:**
- `GET /api/properties/host/my-properties` - List properties
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `PUT /api/properties/:id/activate` - Activate
- `PUT /api/properties/:id/deactivate` - Deactivate
- `DELETE /api/properties/:id` - Delete

**Features:**
- Property list table
- Create property wizard (multi-step)
- Edit property form
- Activate/deactivate toggle
- Property statistics per listing

#### 3. **Photo Management** (Host)
**APIs Used:**
- `POST /api/properties/:id/photos` - Upload photos
- `GET /api/properties/:id/photos` - List photos
- `PUT /api/properties/:id/photos/:photoId` - Update photo
- `DELETE /api/properties/:id/photos/:photoId` - Delete photo
- `POST /api/properties/:id/photos/reorder` - Reorder photos
- `PUT /api/properties/:id/photos/:photoId/cover` - Set cover

**Features:**
- Drag-drop photo upload
- Photo gallery manager
- Drag-to-reorder
- Set cover photo
- Add captions
- Bulk delete

#### 4. **Calendar & Pricing** (Host)
**APIs Used:**
- `GET /api/properties/:id/calendar` - Monthly calendar
- `PUT /api/properties/:id/calendar/pricing/date` - Update date price
- `PUT /api/properties/:id/calendar/pricing/bulk` - Bulk pricing
- `POST /api/properties/:id/calendar/block` - Block dates
- `POST /api/properties/:id/calendar/unblock` - Unblock dates
- `GET /api/properties/:id/calendar/rules` - Availability rules
- `PUT /api/properties/:id/calendar/rules` - Update rules
- `GET /api/properties/:id/calendar/availability` - Availability summary

**Features:**
- Interactive calendar view
- Click to edit pricing
- Drag to select dates
- Block/unblock dates
- Bulk pricing tool
- Weekend/holiday pricing
- Minimum nights settings
- Advance notice settings

#### 5. **Reservation Management** (Host)
**APIs Used:**
- `GET /api/bookings/host/reservations` - Get reservations
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/confirm` - Confirm booking
- `PUT /api/bookings/:id/cancel` - Cancel booking

**Features:**
- Upcoming reservations
- Past reservations
- Booking details modal
- Accept/decline bookings
- Calendar view of bookings
- Guest information

#### 6. **Reviews Management** (Host)
**APIs Used:**
- `GET /api/reviews/property/:propertyId` - Get property reviews
- `PUT /api/reviews/:id/response` - Add host response

**Features:**
- Reviews list by property
- Add host responses
- Review statistics
- Rating breakdown charts

#### 7. **Messaging** (Host)
**APIs Used:**
- Same as Client + Real-time notifications

**Features:**
- Inbox with conversations
- Real-time chat
- Quick responses
- Guest inquiries

#### 8. **Payouts** (Host)
**APIs Used:**
- `GET /api/payments/host/payouts` - Payout history
- Dashboard earnings data

**Features:**
- Payout history table
- Earnings breakdown
- Next payout date
- Bank account setup

#### 9. **Admin Panel** (Admin Only)
**APIs Used:**
- All user/host APIs
- `GET /users` - User management
- Property moderation
- Review moderation

**Features:**
- User management
- Property approval/rejection
- Review moderation
- System settings
- Analytics dashboard

---

## 📋 API ENDPOINTS BY FRONTEND

### CLIENT FRONTEND APIs (28 endpoints):

**Properties (Public):**
- `GET /api/properties` - Search
- `GET /api/properties/:id` - Details

**Vehicles (Public):**
- `GET /api/vehicles` - Search
- `GET /api/vehicles/:id` - Details

**Bookings (Auth):**
- `POST /api/bookings` - Create
- `GET /api/bookings/user` - List
- `GET /api/bookings/:id` - Details
- `PUT /api/bookings/:id/cancel` - Cancel
- `POST /api/bookings/calculate-price` - Calculate

**Reviews (Auth):**
- `POST /api/reviews` - Create
- `GET /api/reviews/property/:id` - List
- `GET /api/reviews/user/:id` - User reviews
- `GET /api/reviews/booking/:id/can-review` - Check eligibility

**Wishlist (Auth):**
- `GET /api/wishlists` - List
- `POST /api/wishlists/properties/:id` - Add
- `DELETE /api/wishlists/properties/:id` - Remove
- `GET /api/wishlists/properties/:id/check` - Check

**Messages (Auth):**
- `GET /api/messages` - Conversations
- `GET /api/messages/:id` - Messages
- `POST /api/messages` - Send
- `POST /api/messages/start` - Start conversation
- `PUT /api/messages/:id/read` - Mark read

**Payments (Auth):**
- `POST /api/payments/intent` - Create intent
- `POST /api/payments/:id/confirm` - Confirm
- `GET /api/payments/:id` - Details
- `GET /api/payments/user/transactions` - History

**Auth:**
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /users/account` - Register
- `GET /users/me` - Get profile

---

### ADMIN/HOST FRONTEND APIs (38+ endpoints):

**Dashboard (Host):**
- `GET /api/host/dashboard` - Overview
- `GET /api/host/dashboard/earnings` - Earnings
- `GET /api/host/dashboard/occupancy` - Occupancy
- `GET /api/host/dashboard/performance` - Performance
- `GET /api/host/dashboard/projection` - Projection

**Property Management (Host):**
- `POST /api/properties` - Create
- `GET /api/properties/host/my-properties` - List
- `GET /api/properties/:id` - Details
- `PUT /api/properties/:id` - Update
- `DELETE /api/properties/:id` - Delete
- `PUT /api/properties/:id/activate` - Activate
- `PUT /api/properties/:id/deactivate` - Deactivate

**Photo Management (Host):**
- `POST /api/properties/:id/photos` - Upload
- `GET /api/properties/:id/photos` - List
- `PUT /api/properties/:id/photos/:photoId` - Update
- `DELETE /api/properties/:id/photos/:photoId` - Delete
- `POST /api/properties/:id/photos/reorder` - Reorder
- `PUT /api/properties/:id/photos/:photoId/cover` - Set cover

**Calendar & Pricing (Host):**
- `GET /api/properties/:id/calendar` - Monthly calendar
- `PUT /api/properties/:id/calendar/pricing/date` - Update date
- `PUT /api/properties/:id/calendar/pricing/bulk` - Bulk update
- `POST /api/properties/:id/calendar/block` - Block dates
- `POST /api/properties/:id/calendar/unblock` - Unblock
- `GET /api/properties/:id/calendar/rules` - Rules
- `PUT /api/properties/:id/calendar/rules` - Update rules
- `GET /api/properties/:id/calendar/pricing` - Pricing overview
- `GET /api/properties/:id/calendar/availability` - Availability

**Reservations (Host):**
- `GET /api/bookings/host/reservations` - List
- `GET /api/bookings/:id` - Details
- `PUT /api/bookings/:id/confirm` - Confirm
- `PUT /api/bookings/:id/cancel` - Cancel

**Reviews (Host):**
- `GET /api/reviews/property/:id` - List
- `PUT /api/reviews/:id/response` - Add response

**Payouts (Host):**
- `GET /api/payments/host/payouts` - Payout history

**Messages (Host):**
- Same as Client

**Vehicle Management (Host):**
- Similar to Property management (5 endpoints)

---

## 🎨 CLIENT FRONTEND STRUCTURE

### Recommended: Next.js 14 App Router

```
client-frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Home/Search
│   │   ├── properties/
│   │   │   └── [id]/page.tsx          # Property details
│   │   ├── vehicles/
│   │   │   └── [id]/page.tsx          # Vehicle details
│   │   └── login/page.tsx              # Login
│   │
│   ├── (authenticated)/
│   │   ├── bookings/
│   │   │   ├── page.tsx                # My bookings
│   │   │   ├── [id]/page.tsx          # Booking details
│   │   │   └── new/page.tsx            # New booking
│   │   ├── messages/
│   │   │   ├── page.tsx                # Conversations
│   │   │   └── [id]/page.tsx          # Chat
│   │   ├── wishlist/page.tsx           # Wishlist
│   │   ├── reviews/page.tsx            # My reviews
│   │   ├── profile/page.tsx            # User profile
│   │   └── payments/page.tsx           # Payment history
│   │
│   └── api/                            # API route handlers
│
├── components/
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGallery.tsx
│   │   ├── PropertyMap.tsx
│   │   └── PropertyReviews.tsx
│   ├── booking/
│   │   ├── BookingCard.tsx
│   │   ├── BookingForm.tsx
│   │   └── PriceBreakdown.tsx
│   ├── payment/
│   │   └── StripeCheckout.tsx
│   ├── messaging/
│   │   ├── ConversationList.tsx
│   │   ├── ChatWindow.tsx
│   │   └── MessageInput.tsx
│   └── common/
│       ├── SearchBar.tsx
│       ├── FilterPanel.tsx
│       └── Layout.tsx
│
├── lib/
│   ├── api/
│   │   ├── properties.ts              # Property API calls
│   │   ├── bookings.ts                # Booking API calls
│   │   ├── payments.ts                # Payment API calls
│   │   ├── messages.ts                # Message API calls
│   │   └── auth.ts                     # Auth API calls
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   ├── useMessages.ts
│   │   └── useWebSocket.ts
│   └── utils/
│       ├── axios-client.ts
│       └── date-utils.ts
│
├── types/
│   ├── property.ts
│   ├── booking.ts
│   ├── payment.ts
│   └── user.ts
│
└── styles/
    └── globals.css
```

### Key Pages:

1. **Home (/)** - Hero + Search + Featured properties
2. **/properties** - Search results with filters
3. **/properties/[id]** - Property details + booking
4. **/bookings** - User bookings dashboard
5. **/messages** - Chat interface
6. **/wishlist** - Saved favorites
7. **/profile** - User settings

---

## 👨‍💼 ADMIN/HOST FRONTEND STRUCTURE

### Recommended: Next.js 14 or React Admin

```
host-admin-frontend/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # Sidebar layout
│   │   ├── page.tsx                    # Dashboard overview
│   │   │
│   │   ├── properties/
│   │   │   ├── page.tsx                # Property list
│   │   │   ├── new/page.tsx            # Create property
│   │   │   ├── [id]/
│   │   │   │   ├── edit/page.tsx       # Edit property
│   │   │   │   ├── photos/page.tsx     # Photo manager
│   │   │   │   ├── calendar/page.tsx   # Calendar & pricing
│   │   │   │   └── settings/page.tsx   # Property settings
│   │   │
│   │   ├── reservations/
│   │   │   ├── page.tsx                # Reservation list
│   │   │   └── [id]/page.tsx          # Reservation details
│   │   │
│   │   ├── reviews/
│   │   │   ├── page.tsx                # All reviews
│   │   │   └── [id]/response/page.tsx # Add response
│   │   │
│   │   ├── messages/
│   │   │   ├── page.tsx                # Inbox
│   │   │   └── [id]/page.tsx          # Conversation
│   │   │
│   │   ├── earnings/
│   │   │   ├── page.tsx                # Earnings dashboard
│   │   │   └── payouts/page.tsx        # Payout history
│   │   │
│   │   ├── vehicles/                   # (if host also rents vehicles)
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   │
│   │   └── settings/
│   │       ├── profile/page.tsx        # Host profile
│   │       └── account/page.tsx        # Account settings
│   │
│   └── (admin)/                        # Admin-only section
│       ├── users/page.tsx              # User management
│       ├── moderation/page.tsx         # Content moderation
│       └── analytics/page.tsx          # System analytics
│
├── components/
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── EarningsChart.tsx
│   │   ├── OccupancyChart.tsx
│   │   └── RecentBookings.tsx
│   ├── property/
│   │   ├── PropertyForm.tsx
│   │   ├── PropertyTable.tsx
│   │   ├── PhotoManager.tsx
│   │   └── CalendarView.tsx
│   ├── calendar/
│   │   ├── MonthCalendar.tsx
│   │   ├── DatePriceEditor.tsx
│   │   ├── BulkPricingTool.tsx
│   │   └── AvailabilityRules.tsx
│   ├── reservation/
│   │   ├── ReservationTable.tsx
│   │   ├── ReservationCard.tsx
│   │   └── GuestInfo.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── DashboardLayout.tsx
│
├── lib/
│   ├── api/
│   │   ├── dashboard.ts
│   │   ├── properties.ts
│   │   ├── reservations.ts
│   │   ├── calendar.ts
│   │   ├── photos.ts
│   │   └── payouts.ts
│   ├── hooks/
│   │   ├── useDashboard.ts
│   │   ├── useProperty.ts
│   │   ├── useCalendar.ts
│   │   └── useReservations.ts
│   └── utils/
│       ├── api-client.ts
│       └── chart-helpers.ts
│
└── types/
    └── (same as client)
```

### Key Pages:

1. **/dashboard** - Overview với charts
2. **/properties** - Manage all properties
3. **/properties/new** - Multi-step creation wizard
4. **/properties/[id]/calendar** - Interactive calendar
5. **/properties/[id]/photos** - Drag-drop photo manager
6. **/reservations** - Upcoming & past bookings
7. **/earnings** - Revenue analytics
8. **/messages** - Guest communication

---

## 🔌 API INTEGRATION

### Shared API Client Setup:

```typescript
// lib/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const { data } = await axios.post('/auth/refresh', { refreshToken });
        localStorage.setItem('access_token', data.accessToken);
        // Retry request
        return apiClient.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### WebSocket Integration:

```typescript
// lib/websocket-client.ts
import io from 'socket.io-client';

export const chatSocket = io('http://localhost:3000/chat', {
  auth: {
    token: localStorage.getItem('access_token'),
  },
  query: {
    userId: getCurrentUserId(),
  },
  transports: ['websocket'],
});

// Event listeners
chatSocket.on('message:received', (message) => {
  // Update UI with new message
});

chatSocket.on('conversation:updated', (data) => {
  // Update conversation unread count
});
```

---

## 🎨 UI/UX RECOMMENDATIONS

### Client Frontend (Guest-focused):
- **Design:** Clean, minimal, image-focused (like Airbnb)
- **Colors:** Primary #FF5A5F (Airbnb red), white background
- **Typography:** Modern sans-serif (Inter, SF Pro)
- **Layout:** Grid layout for properties, full-width hero
- **Mobile:** Mobile-first, responsive design
- **Performance:** Image optimization, lazy loading

### Admin/Host Frontend (Productivity-focused):
- **Design:** Dashboard-style, data-dense
- **Colors:** Professional (blue/gray), accent colors for stats
- **Typography:** Clear, readable (Roboto, Open Sans)
- **Layout:** Sidebar navigation, table-heavy
- **Charts:** Line charts, bar charts, donut charts
- **Mobile:** Tablet-optimized minimum

---

## 📦 RECOMMENDED PACKAGES

### Client Frontend:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "@shadcn/ui": "latest",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "react-query": "^3.39.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "react-datepicker": "^4.21.0",
    "leaflet": "^1.9.0",
    "react-leaflet": "^4.2.0"
  }
}
```

### Host/Admin Frontend:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "antd": "^5.11.0",
    "@ant-design/charts": "^1.4.0",
    "axios": "^1.6.0",
    "socket.io-client": "^4.6.0",
    "react-query": "^3.39.0",
    "recharts": "^2.10.0",
    "react-beautiful-dnd": "^13.1.1",
    "react-dropzone": "^14.2.0",
    "date-fns": "^2.30.0",
    "react-big-calendar": "^1.8.0"
  }
}
```

---

## 🚀 QUICK START GUIDE

### Option 1: Create Client Frontend

```bash
# Create Next.js app
npx create-next-app@latest client-frontend --typescript --tailwind --app

cd client-frontend

# Install dependencies
npm install axios socket.io-client @stripe/stripe-js @stripe/react-stripe-js
npm install @tanstack/react-query zustand date-fns
npm install react-datepicker react-leaflet leaflet

# Add shadcn/ui
npx shadcn-ui@latest init

# Create folder structure
mkdir -p app/(public) app/(authenticated) lib/api lib/hooks components types
```

### Option 2: Create Host/Admin Frontend

```bash
# Create Next.js app
npx create-next-app@latest host-admin-frontend --typescript --app

cd host-admin-frontend

# Install Ant Design
npm install antd @ant-design/icons @ant-design/charts
npm install axios socket.io-client @tanstack/react-query
npm install recharts react-beautiful-dnd react-dropzone
npm install react-big-calendar date-fns

# Create folder structure
mkdir -p app/(dashboard) app/(admin) lib/api lib/hooks components types
```

---

## 📝 SAMPLE API INTEGRATION

### Client - Search Properties:

```typescript
// lib/api/properties.ts
import apiClient from '../api-client';

export const searchProperties = async (params: {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
}) => {
  const { data } = await apiClient.get('/api/properties', { params });
  return data;
};

// Usage in component
import { useQuery } from '@tanstack/react-query';

function PropertySearch() {
  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => searchProperties(filters),
  });
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.data.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### Host - Dashboard Stats:

```typescript
// lib/api/dashboard.ts
import apiClient from '../api-client';

export const getDashboardOverview = async () => {
  const { data } = await apiClient.get('/api/host/dashboard');
  return data;
};

export const getEarningsReport = async (params: {
  period: 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}) => {
  const { data } = await apiClient.get('/api/host/dashboard/earnings', { params });
  return data;
};

// Usage in component
function DashboardOverview() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardOverview,
  });
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Total Earnings" value={`$${data?.totalEarnings}`} />
      <StatCard title="Properties" value={data?.activeProperties} />
      <StatCard title="Occupancy" value={`${data?.occupancyRate}%`} />
      <StatCard title="Avg Rating" value={data?.averageRating} />
    </div>
  );
}
```

---

## 🎯 FEATURES PRIORITIZATION

### MVP (Minimum Viable Product) - 2-3 tuần:

**Client:**
1. ✅ Home & Search
2. ✅ Property details
3. ✅ Booking flow
4. ✅ Login/Register
5. ✅ Payment (Stripe)

**Host:**
1. ✅ Dashboard overview
2. ✅ Property list & create
3. ✅ Reservation list
4. ✅ Calendar view

### Phase 2 - 2-3 tuần:
**Client:**
6. ✅ User dashboard
7. ✅ Messaging
8. ✅ Reviews
9. ✅ Wishlist

**Host:**
5. ✅ Photo management
6. ✅ Calendar pricing
7. ✅ Messaging
8. ✅ Earnings

### Phase 3 - 2-3 tuần:
**Both:**
9. ✅ Advanced filters
10. ✅ Map view
11. ✅ Notifications
12. ✅ Multi-language

---

## 🎨 DESIGN RESOURCES

### UI Kits & Templates:
- **Airbnb Clone Templates:** Themeforest, Creative Tim
- **Design System:** Material UI, Ant Design, Shadcn
- **Icons:** Heroicons, Lucide Icons, Font Awesome
- **Illustrations:** unDraw, Storyset

### Reference Sites:
- **Airbnb.com** - Property listings, search, checkout
- **Booking.com** - Filters, calendar
- **VRBO** - Host dashboard
- **Guesty** - Property management dashboard

---

## 💾 STATE MANAGEMENT

### Client (Simple):
```typescript
// Zustand for global state
import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

const useBookingStore = create((set) => ({
  searchParams: {},
  updateSearch: (params) => set({ searchParams: params }),
}));
```

### Host (Complex):
```typescript
// Redux Toolkit for complex state
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    reservations: reservationsReducer,
    dashboard: dashboardReducer,
  },
});
```

---

## 🔐 AUTHENTICATION FLOW

```typescript
// lib/auth.ts
export const login = async (email: string, password: string) => {
  const { data } = await axios.post('/auth/login', { email, password });
  localStorage.setItem('access_token', data.data.accessToken);
  localStorage.setItem('refresh_token', data.data.refreshToken);
  return data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const { data } = await axios.post('/auth/refresh', { refreshToken });
  localStorage.setItem('access_token', data.accessToken);
  return data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
```

---

## 📱 MOBILE APP (Optional - Future)

### React Native:
```
mobile-app/
├── src/
│   ├── screens/
│   │   ├── Home/
│   │   ├── Property/
│   │   ├── Booking/
│   │   └── Profile/
│   ├── components/
│   ├── navigation/
│   ├── api/
│   └── utils/
└── package.json
```

**Same APIs** - Backend đã sẵn sàng cho mobile!

---

## 🎊 SUMMARY

### Backend ✅ COMPLETE:
- 66 RESTful APIs
- WebSocket support
- Real database
- Real integrations (Stripe, Email, Storage)
- Production-ready

### Frontend 📱 READY TO BUILD:
- **Client App:** 28 APIs available
- **Host/Admin App:** 38+ APIs available
- Clear architecture defined
- Tech stack recommended
- Sample code provided

### Next Steps:
1. **Choose frontend framework** (Next.js recommended)
2. **Setup projects** (2 separate apps)
3. **Implement UI** (3-4 weeks per app)
4. **Connect to backend** (APIs ready)
5. **Deploy** (Vercel/Netlify for frontend, your server for backend)

---

## 🚀 ESTIMATED TIMELINE

**Client Frontend:** 3-4 tuần (full-time)
- Week 1: Home, search, property details
- Week 2: Booking flow, payment integration
- Week 3: User dashboard, messaging
- Week 4: Reviews, wishlist, polish

**Host/Admin Frontend:** 3-4 tuần (full-time)
- Week 1: Dashboard, property CRUD
- Week 2: Calendar & pricing management
- Week 3: Reservations, messaging
- Week 4: Earnings, photos, polish

**Total:** 6-8 tuần for both frontends

---

## 🎉 READY TO START!

Backend đã 100% production-ready với:
- ✅ 66 APIs documented
- ✅ Real data
- ✅ Clean Architecture
- ✅ Type-safe
- ✅ Scalable

**Bạn đã sẵn sàng build 2 frontends! 🚀**
