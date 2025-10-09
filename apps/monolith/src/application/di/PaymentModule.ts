import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPayment } from '@infrastructure/adapter/persistence/typeorm/entity/payment/TypeOrmPayment';
import { TypeOrmTransaction } from '@infrastructure/adapter/persistence/typeorm/entity/payment/TypeOrmTransaction';
import { TypeOrmRefund } from '@infrastructure/adapter/persistence/typeorm/entity/payment/TypeOrmRefund';
import { TypeOrmPayout } from '@infrastructure/adapter/persistence/typeorm/entity/payment/TypeOrmPayout';
import { PaymentRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/PaymentRepositoryAdapter';
import { TransactionRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/TransactionRepositoryAdapter';
import { RefundRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/RefundRepositoryAdapter';
import { PayoutRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/PayoutRepositoryAdapter';
import { CreatePaymentUseCase } from '@core/service/payment/usecase/CreatePaymentUseCase';
import { ConfirmPaymentUseCase } from '@core/service/payment/usecase/ConfirmPaymentUseCase';
import { GetPaymentUseCase } from '@core/service/payment/usecase/GetPaymentUseCase';
import { CreateRefundUseCase } from '@core/service/payment/usecase/CreateRefundUseCase';
import { GetTransactionHistoryUseCase } from '@core/service/payment/usecase/GetTransactionHistoryUseCase';
import { GetHostPayoutsUseCase } from '@core/service/payment/usecase/GetHostPayoutsUseCase';
import { PaymentController } from '@application/api/http-rest/controller/PaymentController';
import { StripePaymentService } from '@infrastructure/adapter/payment/StripePaymentService';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmPayment, TypeOrmTransaction, TypeOrmRefund, TypeOrmPayout]),
  ],
  controllers: [PaymentController],
  providers: [
    // Repositories
    {
      provide: 'PaymentRepositoryPort',
      useClass: PaymentRepositoryAdapter,
    },
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionRepositoryAdapter,
    },
    {
      provide: 'RefundRepositoryPort',
      useClass: RefundRepositoryAdapter,
    },
    {
      provide: 'PayoutRepositoryPort',
      useClass: PayoutRepositoryAdapter,
    },

    // Stripe Service
    StripePaymentService,

    // Use Cases
    {
      provide: CreatePaymentUseCase,
      useFactory: (paymentRepository: PaymentRepositoryAdapter) => {
        return new CreatePaymentUseCase(paymentRepository);
      },
      inject: ['PaymentRepositoryPort'],
    },
    {
      provide: ConfirmPaymentUseCase,
      useFactory: (paymentRepository: PaymentRepositoryAdapter) => {
        return new ConfirmPaymentUseCase(paymentRepository);
      },
      inject: ['PaymentRepositoryPort'],
    },
    {
      provide: GetPaymentUseCase,
      useFactory: (paymentRepository: PaymentRepositoryAdapter) => {
        return new GetPaymentUseCase(paymentRepository);
      },
      inject: ['PaymentRepositoryPort'],
    },
    {
      provide: CreateRefundUseCase,
      useFactory: (
        refundRepository: RefundRepositoryAdapter,
        paymentRepository: PaymentRepositoryAdapter,
      ) => {
        return new CreateRefundUseCase(refundRepository, paymentRepository);
      },
      inject: ['RefundRepositoryPort', 'PaymentRepositoryPort'],
    },
    {
      provide: GetTransactionHistoryUseCase,
      useFactory: (transactionRepository: TransactionRepositoryAdapter) => {
        return new GetTransactionHistoryUseCase(transactionRepository);
      },
      inject: ['TransactionRepositoryPort'],
    },
    {
      provide: GetHostPayoutsUseCase,
      useFactory: (payoutRepository: PayoutRepositoryAdapter) => {
        return new GetHostPayoutsUseCase(payoutRepository);
      },
      inject: ['PayoutRepositoryPort'],
    },
  ],
  exports: [
    CreatePaymentUseCase,
    ConfirmPaymentUseCase,
    GetPaymentUseCase,
    CreateRefundUseCase,
    GetTransactionHistoryUseCase,
    GetHostPayoutsUseCase,
  ],
})
export class PaymentModule {}
