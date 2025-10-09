# 🏠 Client Frontend - Guest Booking Platform

Frontend dành cho khách hàng (guests) để tìm kiếm và đặt phòng/xe.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (no auth)
│   │   ├── page.tsx       # Home/Search
│   │   ├── properties/    # Property listing
│   │   └── login/         # Login page
│   └── (authenticated)/   # Protected pages (auth required)
│       ├── bookings/      # My bookings
│       ├── messages/      # Messaging
│       ├── wishlist/      # Wishlist
│       └── profile/       # User profile
│
├── components/
│   ├── property/          # Property components
│   ├── booking/           # Booking components
│   ├── payment/           # Payment components
│   └── common/            # Shared components
│
└── lib/
    ├── api/               # API integration
    ├── hooks/             # Custom hooks
    └── utils/             # Utilities
```

## 🎯 Features

### Phase 1 (MVP):
- ✅ Search properties/vehicles
- ✅ View property details
- ✅ Create booking
- ✅ Payment with Stripe
- ✅ Login/Register

### Phase 2:
- ✅ User dashboard
- ✅ Real-time messaging
- ✅ Reviews
- ✅ Wishlist

### Phase 3:
- ✅ Advanced filters
- ✅ Map view
- ✅ Multi-language

## 📱 Pages

- `/` - Home with search
- `/properties` - Search results
- `/properties/[id]` - Property details
- `/bookings` - My bookings
- `/bookings/[id]` - Booking details
- `/messages` - Conversations
- `/wishlist` - Saved properties
- `/profile` - User profile

## 🔌 Backend APIs Used

- Properties: 2 endpoints
- Bookings: 5 endpoints
- Payments: 4 endpoints
- Reviews: 4 endpoints
- Wishlists: 4 endpoints
- Messages: 5 endpoints
- Auth: 4 endpoints

**Total: 28 APIs integrated**

## 🎨 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React Query
- Zustand
- Socket.io
- Stripe Elements

## 📝 API Documentation

Backend API: http://localhost:3000/api/docs (Swagger)