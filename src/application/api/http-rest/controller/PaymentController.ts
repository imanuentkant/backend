import { Controller, Post, Get, Body, Param, UseGuards, Req, Headers, Logger, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { StripePaymentService } from '@infrastructure/adapter/payment/StripePaymentService';
import { CreatePaymentUseCase } from '@core/service/payment/usecase/CreatePaymentUseCase';
import { ConfirmPaymentUseCase } from '@core/service/payment/usecase/ConfirmPaymentUseCase';
import { GetPaymentUseCase } from '@core/service/payment/usecase/GetPaymentUseCase';
import { CreateRefundUseCase } from '@core/service/payment/usecase/CreateRefundUseCase';
import { GetTransactionHistoryUseCase } from '@core/service/payment/usecase/GetTransactionHistoryUseCase';
import { GetHostPayoutsUseCase } from '@core/service/payment/usecase/GetHostPayoutsUseCase';
import {
  CreatePaymentIntentResponseDto,
  ConfirmPaymentResponseDto,
  PaymentDetailsResponseDto,
  CreateRefundResponseDto,
  TransactionHistoryResponseDto,
  HostPayoutsResponseDto,
} from '@application/api/http-rest/dto/payment/PaymentResponseDto';
import { Request } from 'express';

/**
 * Payment Controller - Stripe integration for Airbnb-like payments
 */
@Controller('api/payments')
@ApiTags('Payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  constructor(
    private stripeService: StripePaymentService,
    private createPaymentUseCase: CreatePaymentUseCase,
    private confirmPaymentUseCase: ConfirmPaymentUseCase,
    private getPaymentUseCase: GetPaymentUseCase,
    private createRefundUseCase: CreateRefundUseCase,
    private getTransactionHistoryUseCase: GetTransactionHistoryUseCase,
    private getHostPayoutsUseCase: GetHostPayoutsUseCase,
  ) {}
  
  /**
   * Create payment intent for booking
   */
  @Post('intent')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo payment intent cho booking' })
  @ApiResponse({ status: 201, description: 'Payment intent created', type: CreatePaymentIntentResponseDto })
  async createPaymentIntent(
    @Body() body: { bookingId: string; amount: number; currency?: string; breakdown: any },
    @Req() request: Request,
  ): Promise<CreatePaymentIntentResponseDto> {
    const { bookingId, amount, currency = 'USD', breakdown } = body;
    const userId = (request as any).user.id;

    // Create payment intent với Stripe
    const intent = await this.stripeService.createPaymentIntent({
      amount,
      currency: currency.toLowerCase(),
      metadata: {
        bookingId,
        userId,
      },
    });

    // Save payment record to database
    await this.createPaymentUseCase.execute({
      bookingId,
      userId,
      amount,
      currency: currency.toUpperCase(),
      breakdown,
      paymentMethod: 'stripe',
      stripePaymentIntentId: intent.id,
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
  @ApiResponse({ status: 200, description: 'Payment confirmed', type: ConfirmPaymentResponseDto })
  async confirmPayment(@Param('intentId') intentId: string, @Req() request: Request): Promise<ConfirmPaymentResponseDto> {
    const result = await this.stripeService.confirmPaymentIntent(intentId);

    // Update payment status in database
    const payment = await this.confirmPaymentUseCase.execute({
      stripePaymentIntentId: result.id,
    });

    // TODO: Update booking status to confirmed
    // TODO: Send confirmation email to guest
    // TODO: Notify host

    return {
      paymentId: payment.getId(),
      stripePaymentIntentId: result.id,
      amount: result.amount,
      status: payment.getStatus(),
      completedAt: payment.getCompletedAt()!,
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
  @ApiResponse({ status: 200, description: 'Payment details', type: PaymentDetailsResponseDto })
  async getPayment(@Param('id') id: string, @Req() request: Request): Promise<PaymentDetailsResponseDto> {
    const userId = (request as any).user.id;
    const payment = await this.getPaymentUseCase.execute({ paymentId: id, userId });

    return {
      id: payment.getId(),
      bookingId: payment.getBookingId(),
      amount: payment.getAmount(),
      currency: payment.getCurrency(),
      status: payment.getStatus(),
      paymentMethod: payment.getPaymentMethod(),
      breakdown: payment.getBreakdown(),
      payer: {
        id: payment.getUserId(),
        name: (request as any).user.email,
      },
      createdAt: payment.getCreatedAt().toISOString(),
      completedAt: payment.getCompletedAt()?.toISOString(),
    };
  }

  /**
   * Create refund
   */
  @Post(':id/refund')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hoàn tiền cho payment' })
  @ApiResponse({ status: 200, description: 'Refund created', type: CreateRefundResponseDto })
  async createRefund(
    @Param('id') id: string,
    @Body() body: { amount?: number; reason?: string },
    @Req() request: Request,
  ): Promise<CreateRefundResponseDto> {
    const userId = (request as any).user.id;

    // Get payment record
    const payment = await this.getPaymentUseCase.execute({ paymentId: id, userId });

    // Create refund record in database
    const refundEntity = await this.createRefundUseCase.execute({
      paymentId: id,
      userId,
      amount: body.amount,
      reason: body.reason,
    });

    // Create refund với Stripe
    const stripeRefund = await this.stripeService.createRefund({
      paymentIntentId: payment.getStripePaymentIntentId()!,
      amount: body.amount,
      reason: body.reason,
    });

    return {
      refundId: refundEntity.getId(),
      paymentId: id,
      amount: stripeRefund.amount,
      currency: refundEntity.getCurrency(),
      status: stripeRefund.status,
      reason: body.reason,
      processedIn: '5-10 business days',
      createdAt: refundEntity.getCreatedAt(),
      message: `Refund of $${stripeRefund.amount} initiated successfully.`,
    };
  }

  /**
   * Get transaction history
   */
  @Get('user/transactions')
  @UseGuards(HttpJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy lịch sử transactions của user' })
  @ApiResponse({ status: 200, description: 'Transaction history', type: TransactionHistoryResponseDto })
  async getTransactionHistory(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<TransactionHistoryResponseDto> {
    const userId = (request as any).user.id;
    const offset = (page - 1) * limit;

    const result = await this.getTransactionHistoryUseCase.execute({
      userId,
      limit,
      offset,
    });

    return {
      data: result.data.map((transaction) => ({
        id: transaction.getId(),
        type: transaction.getType(),
        amount: transaction.getAmount(),
        currency: transaction.getCurrency(),
        status: transaction.getStatus(),
        description: transaction.getDescription(),
        date: transaction.getDate().toISOString(),
      })),
      meta: {
        page,
        total: result.total,
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
  @ApiResponse({ status: 200, description: 'Payout history', type: HostPayoutsResponseDto })
  async getHostPayouts(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<HostPayoutsResponseDto> {
    const hostId = (request as any).user.id;
    const offset = (page - 1) * limit;

    const result = await this.getHostPayoutsUseCase.execute({
      hostId,
      limit,
      offset,
    });

    return {
      data: result.data.map((payout) => ({
        id: payout.getId(),
        amount: payout.getAmount(),
        currency: payout.getCurrency(),
        status: payout.getStatus(),
        description: payout.getDescription(),
        paidAt: payout.getPaidAt()?.toISOString().split('T')[0],
        expectedArrival: payout.getExpectedArrivalDate()?.toISOString().split('T')[0],
      })),
      summary: result.summary,
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

