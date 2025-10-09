import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRepositoryPort } from '@core/domain/payment/port/PaymentRepositoryPort';
import { Payment } from '@core/domain/payment/entity/Payment';
import { TypeOrmPayment } from '../entity/payment/TypeOrmPayment';
import { PaymentMapper } from '../mapper/PaymentMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class PaymentRepositoryAdapter implements PaymentRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmPayment)
    private readonly repository: Repository<TypeOrmPayment>,
  ) {}

  public async save(payment: Payment): Promise<Payment> {
    let id = payment.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const paymentWithId = new Payment({
      id,
      bookingId: payment.getBookingId(),
      userId: payment.getUserId(),
      amount: payment.getAmount(),
      currency: payment.getCurrency(),
      status: payment.getStatus(),
      paymentMethod: payment.getPaymentMethod(),
      stripePaymentIntentId: payment.getStripePaymentIntentId() || undefined,
      breakdown: payment.getBreakdown(),
      metadata: payment.getMetadata(),
      completedAt: payment.getCompletedAt() || undefined,
      createdAt: payment.getCreatedAt(),
      updatedAt: payment.getUpdatedAt(),
    });

    const ormEntity = PaymentMapper.toOrm(paymentWithId);
    const saved = await this.repository.save(ormEntity);
    return PaymentMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<Payment>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }

  public async findByBookingId(bookingId: string): Promise<Nullable<Payment>> {
    const ormEntity = await this.repository.findOne({ where: { booking_id: bookingId } });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }

  public async findByUserId(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Payment[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('payment')
      .where('payment.user_id = :userId', { userId })
      .orderBy('payment.created_at', 'DESC');

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }
    if (options?.offset) {
      queryBuilder.skip(options.offset);
    }

    const ormEntities = await queryBuilder.getMany();
    return ormEntities.map((entity) => PaymentMapper.toDomain(entity));
  }

  public async findByStripePaymentIntentId(intentId: string): Promise<Nullable<Payment>> {
    const ormEntity = await this.repository.findOne({
      where: { stripe_payment_intent_id: intentId },
    });
    return ormEntity ? PaymentMapper.toDomain(ormEntity) : null;
  }

  public async update(payment: Payment): Promise<Payment> {
    const ormEntity = PaymentMapper.toOrm(payment);
    const saved = await this.repository.save(ormEntity);
    return PaymentMapper.toDomain(saved);
  }

  public async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { user_id: userId } });
  }
}
