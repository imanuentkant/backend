# 👨‍💼 Host/Admin Frontend - Property Management Dashboard

Frontend dành cho hosts quản lý properties và admins quản lý hệ thống.

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
```

## 📂 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard overview
│   ├── properties/        # Property management
│   ├── reservations/      # Reservation management
│   ├── calendar/          # Calendar & pricing
│   ├── earnings/          # Earnings & payouts
│   └── messages/          # Guest messaging
│
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── property/          # Property components
│   ├── calendar/          # Calendar components
│   └── layout/            # Layout components
│
└── lib/
    ├── api/               # API integration
    ├── hooks/             # Custom hooks
    └── utils/             # Utilities
```

## 🎯 Features

### Phase 1 (MVP):
- ✅ Dashboard overview với stats
- ✅ Property list & create
- ✅ Reservation list
- ✅ Login/Auth

### Phase 2:
- ✅ Photo management
- ✅ Calendar & pricing tool
- ✅ Earnings dashboard
- ✅ Messaging

### Phase 3:
- ✅ Advanced analytics
- ✅ Review management
- ✅ Multi-property management

## 📱 Pages

- `/` - Dashboard overview
- `/properties` - Property list
- `/properties/new` - Create property
- `/properties/[id]/edit` - Edit property
- `/properties/[id]/photos` - Photo management
- `/properties/[id]/calendar` - Calendar & pricing
- `/reservations` - Reservations list
- `/earnings` - Earnings & payouts
- `/messages` - Guest messages
- `/reviews` - Reviews management

## 🔌 Backend APIs Used

- Dashboard: 5 endpoints
- Properties: 7 endpoints
- Photos: 6 endpoints
- Calendar: 9 endpoints
- Reservations: 4 endpoints
- Payouts: 1 endpoint
- Messages: 5 endpoints

**Total: 38+ APIs integrated**

## 🎨 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Ant Design
- React Query
- Recharts
- Socket.io

## 📝 API Documentation

Backend API: http://localhost:3000/api/docs (Swagger)