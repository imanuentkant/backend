export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export enum CancellationPolicy {
  FLEXIBLE = 'flexible',     // Full refund 24h before check-in
  MODERATE = 'moderate',      // Full refund 5 days before check-in
  STRICT = 'strict',          // 50% refund up to 1 week before
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL_REFUND = 'partial_refund',
}

