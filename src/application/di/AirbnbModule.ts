import { Module } from '@nestjs/common';
import { PropertyModule } from './PropertyModule';
import { BookingModule } from './BookingModule';
import { ReviewModule } from './ReviewModule';
import { VehicleModule } from './VehicleModule';
import { MessageModule } from './MessageModule';
import { PaymentModule } from './PaymentModule';
import { WishlistModule } from './WishlistModule';
import { PropertyCalendarModule } from './PropertyCalendarModule';
import { PropertyPhotoController } from '@application/api/http-rest/controller/PropertyPhotoController';
import { HostDashboardController } from '@application/api/http-rest/controller/HostDashboardController';
import { EmailService } from '@infrastructure/adapter/notification/EmailService';
import { MessagingWebSocketGateway } from '@infrastructure/adapter/messaging/WebSocketGateway';

/**
 * Airbnb Module - Multi-Platform Booking System
 * 
 * Property Management (10 endpoints) ✅
 * Vehicle Rental (5 endpoints) ✅
 * Booking System (7 endpoints) ✅
 * Review System (4 endpoints) ✅
 * Messaging System (6 endpoints) ✅
 * Host Dashboard (5 endpoints) ✅
 * 
 * TOTAL: 37+ Endpoints - 100% Real Data - 100% Type-Safe
 */
@Module({
  imports: [
    PropertyModule,          // Property management
    VehicleModule,           // Vehicle rental ✅
    BookingModule,           // Booking + Dashboard ✅
    ReviewModule,            // Review system
    MessageModule,           // Messaging system ✅
    PaymentModule,           // Payment system ✅
    WishlistModule,          // Wishlist system ✅
    PropertyCalendarModule,  // Property Calendar ✅
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
    EmailService,
  ],
})
export class AirbnbModule {}

