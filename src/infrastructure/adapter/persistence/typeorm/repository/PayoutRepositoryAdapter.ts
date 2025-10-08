import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayoutRepositoryPort } from '@core/domain/payment/port/PayoutRepositoryPort';
import { Payout, PayoutStatus } from '@core/domain/payment/entity/Payout';
import { TypeOrmPayout } from '../entity/payment/TypeOrmPayout';
import { PayoutMapper } from '../mapper/PayoutMapper';
import { Nullable } from '@core/common/type/CommonTypes';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

@Injectable()
export class PayoutRepositoryAdapter implements PayoutRepositoryPort {
  constructor(
    @InjectRepository(TypeOrmPayout)
    private readonly repository: Repository<TypeOrmPayout>,
  ) {}

  public async save(payout: Payout): Promise<Payout> {
    let id = payout.getId();
    if (!id) {
      id = UuidGenerator.generate();
    }
    const payoutWithId = new Payout({
      id,
      hostId: payout.getHostId(),
      amount: payout.getAmount(),
      currency: payout.getCurrency(),
      status: payout.getStatus(),
      description: payout.getDescription(),
      bookingIds: payout.getBookingIds(),
      expectedArrivalDate: payout.getExpectedArrivalDate() || undefined,
      paidAt: payout.getPaidAt() || undefined,
      stripePayoutId: payout.getStripePayoutId() || undefined,
      metadata: payout.getMetadata(),
      createdAt: payout.getCreatedAt(),
      updatedAt: payout.getUpdatedAt(),
    });

    const ormEntity = PayoutMapper.toOrm(payoutWithId);
    const saved = await this.repository.save(ormEntity);
    return PayoutMapper.toDomain(saved);
  }

  public async findById(id: string): Promise<Nullable<Payout>> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? PayoutMapper.toDomain(ormEntity) : null;
  }

  public async findByHostId(
    hostId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Payout[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('payout')
      .where('payout.host_id = :hostId', { hostId })
      .orderBy('payout.created_at', 'DESC');

    if (options?.limit) {
      queryBuilder.take(options.limit);
    }
    if (options?.offset) {
      queryBuilder.skip(options.offset);
    }

    const ormEntities = await queryBuilder.getMany();
    return ormEntities.map((entity) => PayoutMapper.toDomain(entity));
  }

  public async update(payout: Payout): Promise<Payout> {
    const ormEntity = PayoutMapper.toOrm(payout);
    const saved = await this.repository.save(ormEntity);
    return PayoutMapper.toDomain(saved);
  }

  public async getTotalEarnings(hostId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payout')
      .select('SUM(payout.amount)', 'total')
      .where('payout.host_id = :hostId', { hostId })
      .andWhere('payout.status IN (:...statuses)', {
        statuses: [PayoutStatus.PAID, PayoutStatus.IN_TRANSIT],
      })
      .getRawOne();

    return Number(result?.total || 0);
  }

  public async getPendingPayouts(hostId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payout')
      .select('SUM(payout.amount)', 'total')
      .where('payout.host_id = :hostId', { hostId })
      .andWhere('payout.status = :status', { status: PayoutStatus.IN_TRANSIT })
      .getRawOne();

    return Number(result?.total || 0);
  }

  public async getAvailableForPayout(hostId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('payout')
      .select('SUM(payout.amount)', 'total')
      .where('payout.host_id = :hostId', { hostId })
      .andWhere('payout.status = :status', { status: PayoutStatus.PENDING })
      .getRawOne();

    return Number(result?.total || 0);
  }
}
