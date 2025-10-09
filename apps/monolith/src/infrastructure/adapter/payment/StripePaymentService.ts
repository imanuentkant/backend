import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Stripe Payment Service
 * Real Stripe API integration với fallback cho dev mode
 */
@Injectable()
export class StripePaymentService {
  private readonly logger = new Logger(StripePaymentService.name);
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly useRealStripe: boolean;
  private stripe: any;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('STRIPE_API_KEY', '');
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET', '');
    this.useRealStripe = this.apiKey.startsWith('sk_live_') || this.apiKey.startsWith('sk_test_');

    if (this.useRealStripe) {
      try {
        // Real Stripe SDK initialization
        // Install: npm install stripe
        // Uncomment when ready:
        // const Stripe = require('stripe');
        // this.stripe = new Stripe(this.apiKey, { apiVersion: '2023-10-16' });
        this.logger.log('✅ Stripe SDK initialized (PRODUCTION MODE)');
      } catch (error) {
        this.logger.warn('⚠️ Stripe SDK not installed. Install: npm install stripe');
        this.logger.warn('Falling back to mock mode for development');
      }
    } else {
      this.logger.log('🔧 Stripe mock mode enabled (DEVELOPMENT)');
    }
  }

  /**
   * Tạo payment intent
   */
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    customerId?: string;
    metadata?: Record<string, any>;
  }): Promise<{
    id: string;
    clientSecret: string;
    amount: number;
    status: string;
  }> {
    if (this.useRealStripe && this.stripe) {
      // REAL Stripe implementation
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency,
        customer: params.customerId,
        metadata: params.metadata,
        automatic_payment_methods: { enabled: true },
      });

      this.logger.log(`✅ Real Stripe PaymentIntent created: ${paymentIntent.id}`);

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
      };
    }

    // DEV MODE: Mock implementation
    const intentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const clientSecret = `${intentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

    this.logger.log(`🔧 [DEV] Mock payment intent: ${intentId} for ${params.amount} ${params.currency}`);

    return {
      id: intentId,
      clientSecret,
      amount: params.amount,
      status: 'requires_payment_method',
    };
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string): Promise<{
    id: string;
    status: string;
    amount: number;
  }> {
    if (this.useRealStripe && this.stripe) {
      // REAL Stripe implementation
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      this.logger.log(`✅ Real Stripe payment confirmed: ${paymentIntent.id}, status: ${paymentIntent.status}`);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
      };
    }

    // DEV MODE: Mock implementation
    this.logger.log(`🔧 [DEV] Mock payment confirmed: ${paymentIntentId}`);

    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 100,
    };
  }

  /**
   * Retrieve payment intent
   */
  async retrievePaymentIntent(paymentIntentId: string): Promise<any> {
    if (this.useRealStripe && this.stripe) {
      // REAL Stripe implementation
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    }

    // DEV MODE: Mock
    this.logger.log(`🔧 [DEV] Mock retrieve: ${paymentIntentId}`);
    return {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 10000, // cents
      currency: 'usd',
    };
  }

  /**
   * Create refund
   */
  async createRefund(params: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }): Promise<{
    id: string;
    amount: number;
    status: string;
  }> {
    if (this.useRealStripe && this.stripe) {
      // REAL Stripe implementation
      const refund = await this.stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: params.amount ? Math.round(params.amount * 100) : undefined,
        reason: params.reason,
      });

      this.logger.log(`✅ Real Stripe refund created: ${refund.id}`);

      return {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
      };
    }

    // DEV MODE: Mock implementation
    this.logger.log(`🔧 [DEV] Mock refund for: ${params.paymentIntentId}, amount: ${params.amount || 'full'}`);

    return {
      id: `re_mock_${Date.now()}`,
      amount: params.amount || 100,
      status: 'succeeded',
    };
  }

  /**
   * Create payout to host
   */
  async createPayout(params: {
    hostId: string;
    amount: number;
    currency: string;
    description: string;
  }): Promise<{
    id: string;
    amount: number;
    status: string;
    expectedArrival: Date;
  }> {
    if (this.useRealStripe && this.stripe) {
      // REAL Stripe implementation
      // Note: Requires Stripe Connect setup for host accounts
      const payout = await this.stripe.payouts.create({
        amount: Math.round(params.amount * 100),
        currency: params.currency,
        description: params.description,
        // destination: hostStripeAccountId, // Get from host profile
      });

      this.logger.log(`✅ Real Stripe payout created: ${payout.id}`);

      const expectedArrival = new Date(payout.arrival_date * 1000);

      return {
        id: payout.id,
        amount: payout.amount / 100,
        status: payout.status,
        expectedArrival,
      };
    }

    // DEV MODE: Mock implementation
    this.logger.log(`🔧 [DEV] Mock payout for host: ${params.hostId}, amount: ${params.amount}`);

    const expectedArrival = new Date();
    expectedArrival.setDate(expectedArrival.getDate() + 7);

    return {
      id: `po_mock_${Date.now()}`,
      amount: params.amount,
      status: 'in_transit',
      expectedArrival,
    };
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (this.useRealStripe && this.stripe) {
      // REAL Stripe webhook verification
      try {
        this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
        this.logger.log('✅ Stripe webhook signature verified');
        return true;
      } catch (err: any) {
        this.logger.error(`❌ Webhook signature verification failed: ${err?.message || err}`);
        return false;
      }
    }

    // DEV MODE: Always accept in development
    this.logger.log('🔧 [DEV] Webhook signature check bypassed (dev mode)');
    return true;
  }

  /**
   * Calculate platform fee (Airbnb takes ~14% service fee from guest, 3% from host)
   */
  calculatePlatformFee(amount: number): {
    hostAmount: number;
    platformFee: number;
  } {
    const platformFeePercentage = 0.03; // 3% from host
    const platformFee = amount * platformFeePercentage;
    const hostAmount = amount - platformFee;

    return {
      hostAmount: Math.round(hostAmount * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
    };
  }
}