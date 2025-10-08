import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundRepositoryPort } from '@core/domain/payment/port/RefundRepositoryPort';
import { Refund } from '@core/domain/payment/entity/Refund';
import { TypeOrmRefund } from '../entity/payment/TypeOrmRefund';
import { RefundMapper } from '../mapper/RefundMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class RefundRepositoryAdapter implements RefundRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmRefund)
    private readonly repository: Repository<TypeOrmRefund>,
  ) {}

  public async save(refund: Refund): Promise<Refund> {
    let id = refund.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const refundWithId = new Refund({
      id,
      paymentId: refund.getPaymentId(),
      userId: refund.getUserId(),
      amount: refund.getAmount(),
      currency: refund.getCurrency(),
      status: refund.getStatus(),
      reason: refund.getReason() || undefined,
      stripeRefundId: refund.getStripeRefundId() || undefined,
      processedAt: refund.getProcessedAt() || undefined,
      createdAt: refund.getCreatedAt(),
      updatedAt: refund.getUpdatedAt(),
    });

    const ormEntity = RefundMapper.toOrm(refundWithId);
    const saved = await this.repository.save(ormEntity);
    return RefundMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<Refund>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? RefundMapper.toDomain(ormEntity) : null;
  }

  public async findByPaymentId(paymentId: string): Promise<Refund[]> {
    const ormEntities = await this.repository.find({
      where: { payment_id: paymentId },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map((entity) => RefundMapper.toDomain(entity));
  }

  public async findByUserId(userId: string): Promise<Refund[]> {
    const ormEntities = await this.repository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    return ormEntities.map((entity) => RefundMapper.toDomain(entity));
  }

  public async update(refund: Refund): Promise<Refund> {
    const ormEntity = RefundMapper.toOrm(refund);
    const saved = await this.repository.save(ormEntity);
    return RefundMapper.toDomain(saved);
  }
}
