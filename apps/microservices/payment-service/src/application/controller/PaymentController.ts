import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
  
  @Post('create-intent')
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created' })
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string; description: string },
    @Req() request: Request,
  ) {
    const userId = (request as any).user?.id || 'mock-user-id';
    return {
      success: true,
      data: {
        paymentIntentId: 'pi_mock_' + Date.now(),
        clientSecret: 'secret_mock_' + Date.now(),
        amount: body.amount,
        currency: body.currency,
        status: 'requires_payment_method',
        userId,
      },
    };
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(
    @Body() body: { paymentIntentId: string; paymentMethodId: string },
  ) {
    return {
      success: true,
      data: {
        paymentIntentId: body.paymentIntentId,
        status: 'succeeded',
        confirmedAt: new Date(),
      },
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  async getPaymentHistory(@Req() request: Request) {
    const userId = (request as any).user?.id || 'mock-user-id';
    return {
      success: true,
      data: [
        {
          id: 'payment-1',
          amount: 100,
          currency: 'USD',
          status: 'succeeded',
          description: 'Dating Premium Subscription',
          createdAt: new Date(),
          userId,
        },
      ],
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  async getPayment(@Param('id') id: string) {
    return {
      success: true,
      data: {
        id,
        amount: 100,
        currency: 'USD',
        status: 'succeeded',
        createdAt: new Date(),
      },
    };
  }

  @Post('refund')
  @ApiOperation({ summary: 'Refund payment' })
  async refundPayment(
    @Body() body: { paymentIntentId: string; amount?: number; reason: string },
  ) {
    return {
      success: true,
      data: {
        refundId: 'ref_mock_' + Date.now(),
        paymentIntentId: body.paymentIntentId,
        amount: body.amount,
        status: 'succeeded',
        reason: body.reason,
        createdAt: new Date(),
      },
    };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook' })
  async handleWebhook(@Body() body: any) {
    // Handle Stripe webhooks
    return {
      success: true,
      received: true,
    };
  }
}

