# 💳 Payment Service

Microservice for payment processing & transactions.

## Features

- ✅ Payment processing (Stripe)
- ✅ Payment intents
- ✅ Refunds
- ✅ Payment history
- ✅ Webhook handling
- ✅ Transaction management
- ✅ Kafka events integration

## API Endpoints

### Payments
- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `GET /payments/history` - Get payment history
- `GET /payments/:id` - Get payment details
- `POST /payments/refund` - Refund payment

### Webhooks
- `POST /payments/webhook` - Stripe webhook handler

## Quick Start

```bash
npm install
npm run start:dev
```

## Environment

```env
PORT=3008
DB_HOST=localhost
DB_DATABASE=payment_db
KAFKA_BROKERS=localhost:19092
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Setup

1. Create Stripe account
2. Get API keys
3. Configure webhook endpoint
4. Test with Stripe CLI

## Docker

```bash
docker build -t payment-service .
docker run -p 3008:3008 \
  -e STRIPE_SECRET_KEY=sk_test_... \
  payment-service
```

**Status:** ✅ Ready for production

