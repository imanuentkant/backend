import { Module } from '@nestjs/common';
import { PropertyModule } from './PropertyModule';
import { BookingModule } from './BookingModule';
import { ReviewModule } from './ReviewModule';
import { VehicleModule } from './VehicleModule';
import { MessageModule } from './MessageModule';
import { PaymentModule } from './PaymentModule';
import { WishlistModule } from './WishlistModule';
import { PropertyCalendarModule } from './PropertyCalendarModule';
import { DatingModule } from './DatingModule';
import { PropertyPhotoController } from '@application/api/http-rest/controller/PropertyPhotoController';
import { HostDashboardController } from '@application/api/http-rest/controller/HostDashboardController';
import { EmailService } from '@infrastructure/adapter/notification/EmailService';
import { MessagingWebSocketGateway } from '@infrastructure/adapter/messaging/WebSocketGateway';

/**
 * Multi-Platform System - Booking + Dating
 * 
 * BOOKING PLATFORM:
 * Property Management (10 endpoints) ✅
 * Vehicle Rental (5 endpoints) ✅
 * Booking System (7 endpoints) ✅
 * Review System (4 endpoints) ✅
 * Messaging System (6 endpoints) ✅
 * Host Dashboard (5 endpoints) ✅
 * 
 * DATING PLATFORM (NEW): 💘
 * Dating Profiles (7 endpoints) ✅
 * Swipe & Match System ✅
 * Date Proposals ✅
 * 
 * TOTAL: 73+ Endpoints - 100% Real Data - 100% Type-Safe
 */
@Module({
  imports: [
    // Booking Platform
    PropertyModule,          // Property management
    VehicleModule,           // Vehicle rental ✅
    BookingModule,           // Booking + Dashboard ✅
    ReviewModule,            // Review system
    MessageModule,           // Messaging system ✅
    PaymentModule,           // Payment system ✅
    WishlistModule,          // Wishlist system ✅
    PropertyCalendarModule,  // Property Calendar ✅
    
    // Dating Platform 💘
    DatingModule,            // Dating, Swipe, Match, Date Proposals ✅
  ],
  controllers: [
    PropertyPhotoController,         // Photo management
    HostDashboardController,
  ],
  providers: [
    EmailService,
    MessagingWebSocketGateway,
    // Use cases are imported from modules
  ],
  exports: [
    PropertyModule,
    VehicleModule,
    BookingModule,
    ReviewModule,
    MessageModule,
    PaymentModule,
    WishlistModule,
    PropertyCalendarModule,
    DatingModule,
    EmailService,
  ],
})
export class AirbnbModule {}

