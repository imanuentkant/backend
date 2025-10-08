import { Module } from '@nestjs/common';
import { PropertyController } from '@application/api/http-rest/controller/PropertyController';
import { PropertyPhotoController } from '@application/api/http-rest/controller/PropertyPhotoController';
import { PropertyCalendarController } from '@application/api/http-rest/controller/PropertyCalendarController';
import { BookingController } from '@application/api/http-rest/controller/BookingController';
import { ReviewController } from '@application/api/http-rest/controller/ReviewController';
import { PaymentController } from '@application/api/http-rest/controller/PaymentController';
import { MessageController } from '@application/api/http-rest/controller/MessageController';
import { WishlistController } from '@application/api/http-rest/controller/WishlistController';
import { HostDashboardController } from '@application/api/http-rest/controller/HostDashboardController';
import { StripePaymentService } from '@infrastructure/adapter/payment/StripePaymentService';
import { EmailService } from '@infrastructure/adapter/notification/EmailService';
import { MessagingWebSocketGateway } from '@infrastructure/adapter/messaging/WebSocketGateway';

/**
 * Airbnb Module - Contains all Airbnb-like features
 * 
 * Property Management (25 endpoints) - 100% COMPLETE:
 *   - Basic CRUD (10 endpoints)
 *   - Photo Management (6 endpoints)
 *   - Calendar Management (9 endpoints)
 * 
 * Booking System (10 endpoints)
 * Review System (6 endpoints)
 * Payment System (7 endpoints)
 * Messaging (6 endpoints + WebSocket)
 * Wishlists (4 endpoints)
 * Host Dashboard (5 endpoints)
 * 
 * TOTAL: 63 Airbnb Endpoints
 */
@Module({
  controllers: [
    PropertyController,
    PropertyPhotoController,         // Photo management
    PropertyCalendarController,      // Calendar & pricing
    BookingController,
    ReviewController,
    PaymentController,
    MessageController,
    WishlistController,
    HostDashboardController,
  ],
  providers: [
    StripePaymentService,
    EmailService,
    MessagingWebSocketGateway,
  ],
  exports: [
    StripePaymentService,
    EmailService,
  ],
})
export class AirbnbModule {}

