import { Controller, Post, Get, Body, Param, UseGuards, Req, Headers, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { StripePaymentService } from '@infrastructure/adapter/payment/StripePaymentService';
import { PaymentStatus } from '@core/common/enums/BookingEnums';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

/**
 * Payment Controller - Stripe integration for Airbnb-like payments
 */
@Controller('api/payments')
@ApiTags('Payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(private stripeService: StripePaymentService) {}
  
  /**
   * Create payment intent for booking
   */
  @Post('intent')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo payment intent cho booking' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  async createPaymentIntent(
    @Body() body: { bookingId: string; amount: number; currency?: string },
    @Req() request: any,
  ) {
    const { bookingId, amount, currency = 'USD' } = body;
    const userId = request.user.id;

    // Create payment intent với Stripe
    const intent = await this.stripeService.createPaymentIntent({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        bookingId,
        userId,
      },
    });

    return {
      paymentIntentId: intent.id,
      clientSecret: intent.clientSecret,
      amount: intent.amount,
      currency: currency.toUpperCase(),
      status: intent.status,
      bookingId,
      message: 'Payment intent created. Use clientSecret to confirm payment on frontend.',
    };
  }

  /**
   * Confirm payment (called after frontend confirms với Stripe)
   */
  @Post(':intentId/confirm')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xác nhận payment đã thành công' })
  @ApiResponse({ status: 200, description: 'Payment confirmed' })
  async confirmPayment(@Param('intentId') intentId: string, @Req() request: any) {
    const result = await this.stripeService.confirmPaymentIntent(intentId);

    // Save payment record to database
    // Update booking status to confirmed
    // Send confirmation email to guest
    // Notify host

    return {
      paymentId: UuidGenerator.generate(),
      stripePaymentIntentId: result.id,
      amount: result.amount,
      status: PaymentStatus.COMPLETED,
      completedAt: new Date(),
      message: 'Payment successful! Booking confirmed.',
    };
  }

  /**
   * Get payment details
   */
  @Get(':id')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết payment' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  async getPayment(@Param('id') id: string, @Req() request: any) {
    // Mock response
    return {
      id,
      bookingId: UuidGenerator.generate(),
      amount: 476.00,
      currency: 'USD',
      status: PaymentStatus.COMPLETED,
      paymentMethod: 'stripe',
      breakdown: {
        subtotal: 400,
        cleaningFee: 20,
        serviceFee: 56,
        total: 476,
      },
      payer: {
        id: request.user.id,
        name: request.user.email,
      },
      createdAt: '2025-10-08T10:00:00Z',
      completedAt: '2025-10-08T10:05:00Z',
    };
  }

  /**
   * Create refund
   */
  @Post(':id/refund')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hoàn tiền cho payment' })
  @ApiResponse({ status: 200, description: 'Refund created' })
  async createRefund(
    @Param('id') id: string,
    @Body() body: { amount?: number; reason?: string },
    @Req() request: any,
  ) {
    // Get payment record
    // Check if refund allowed
    // Create refund với Stripe

    const paymentIntentId = 'pi_mock_123'; // Should get from payment record
    
    const refund = await this.stripeService.createRefund({
      paymentIntentId,
      amount: body.amount,
      reason: body.reason,
    });

    return {
      refundId: refund.id,
      paymentId: id,
      amount: refund.amount,
      currency: 'USD',
      status: refund.status,
      reason: body.reason,
      processedIn: '5-10 business days',
      createdAt: new Date(),
      message: `Refund of $${refund.amount} initiated successfully.`,
    };
  }

  /**
   * Get transaction history
   */
  @Get('user/transactions')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch sử transactions của user' })
  @ApiResponse({ status: 200, description: 'Transaction history' })
  async getTransactionHistory(@Req() request: any) {
    const userId = request.user.id;

    // Mock data
    return {
      data: [
        {
          id: UuidGenerator.generate(),
          type: 'payment',
          amount: 476.00,
          currency: 'USD',
          status: 'completed',
          description: 'Booking payment for Cozy Apartment',
          date: '2025-10-01T10:00:00Z',
        },
        {
          id: UuidGenerator.generate(),
          type: 'refund',
          amount: 400.00,
          currency: 'USD',
          status: 'completed',
          description: 'Refund for cancelled booking',
          date: '2025-09-15T14:30:00Z',
        },
      ],
      meta: {
        page: 1,
        total: 2,
      },
    };
  }

  /**
   * Get host payouts
   */
  @Get('host/payouts')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách payouts (Host)' })
  @ApiResponse({ status: 200, description: 'Payout history' })
  async getHostPayouts(@Req() request: any) {
    // Mock data
    return {
      data: [
        {
          id: UuidGenerator.generate(),
          amount: 1455.00,
          currency: 'USD',
          status: 'paid',
          description: '3 bookings completed',
          paidAt: '2025-10-01',
          expectedArrival: '2025-10-08',
        },
        {
          id: UuidGenerator.generate(),
          amount: 970.00,
          currency: 'USD',
          status: 'in_transit',
          description: '2 bookings completed',
          expectedArrival: '2025-10-15',
        },
      ],
      summary: {
        totalEarnings: 5420.00,
        pendingPayouts: 970.00,
        availableForPayout: 0,
        nextPayoutDate: '2025-10-15',
      },
    };
  }

  /**
   * Webhook handler for Stripe events
   */
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleStripeWebhook(
    @Body() body: any,
    @Headers('stripe-signature') signature: string,
  ) {
    // Verify webhook signature
    const isValid = this.stripeService.verifyWebhookSignature(
      JSON.stringify(body),
      signature,
    );

    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    // Handle events
    switch (body.type) {
      case 'payment_intent.succeeded':
        // Update payment status
        // Confirm booking
        // Send confirmation email
        this.logger.log(`Payment succeeded: ${body.data.object.id}`);
        break;

      case 'payment_intent.payment_failed':
        // Update payment status
        // Notify user
        this.logger.log(`Payment failed: ${body.data.object.id}`);
        break;

      case 'charge.refunded':
        // Update refund status
        // Notify user
        this.logger.log(`Refund processed: ${body.data.object.id}`);
        break;

      default:
        this.logger.log(`Unhandled event type: ${body.type}`);
    }

    return { received: true };
  }
}

