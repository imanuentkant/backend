import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPropertyCalendar } from '@infrastructure/adapter/persistence/typeorm/entity/property/TypeOrmPropertyCalendar';
import { TypeOrmAvailabilityRules } from '@infrastructure/adapter/persistence/typeorm/entity/property/TypeOrmAvailabilityRules';
import { PropertyCalendarRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/PropertyCalendarRepositoryAdapter';
import { GetPropertyCalendarUseCase } from '@core/service/property/usecase/GetPropertyCalendarUseCase';
import { UpdateDatePricingUseCase } from '@core/service/property/usecase/UpdateDatePricingUseCase';
import { BlockDatesUseCase } from '@core/service/property/usecase/BlockDatesUseCase';
import { UnblockDatesUseCase } from '@core/service/property/usecase/UnblockDatesUseCase';
import { BulkUpdatePricingUseCase } from '@core/service/property/usecase/BulkUpdatePricingUseCase';
import { GetAvailabilityRulesUseCase } from '@core/service/property/usecase/GetAvailabilityRulesUseCase';
import { UpdateAvailabilityRulesUseCase } from '@core/service/property/usecase/UpdateAvailabilityRulesUseCase';
import { GetAvailabilitySummaryUseCase } from '@core/service/property/usecase/GetAvailabilitySummaryUseCase';
import { PropertyCalendarController } from '@application/api/http-rest/controller/PropertyCalendarController';
import { PropertyModule } from './PropertyModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmPropertyCalendar, TypeOrmAvailabilityRules]),
    PropertyModule,
    forwardRef(() => import('./BookingModule').then(m => m.BookingModule)),
  ],
  controllers: [PropertyCalendarController],
  providers: [
    // Repository
    {
      provide: 'PropertyCalendarRepositoryPort',
      useClass: PropertyCalendarRepositoryAdapter,
    },

    // Use Cases
    {
      provide: GetPropertyCalendarUseCase,
      useFactory: (calendarRepository, propertyRepository) => {
        return new GetPropertyCalendarUseCase(calendarRepository, propertyRepository);
      },
      inject: ['PropertyCalendarRepositoryPort', 'PropertyRepositoryPort'],
    },
    {
      provide: UpdateDatePricingUseCase,
      useFactory: (repository: PropertyCalendarRepositoryAdapter) => {
        return new UpdateDatePricingUseCase(repository);
      },
      inject: ['PropertyCalendarRepositoryPort'],
    },
    {
      provide: BlockDatesUseCase,
      useFactory: (repository: PropertyCalendarRepositoryAdapter) => {
        return new BlockDatesUseCase(repository);
      },
      inject: ['PropertyCalendarRepositoryPort'],
    },
    {
      provide: UnblockDatesUseCase,
      useFactory: (repository: PropertyCalendarRepositoryAdapter) => {
        return new UnblockDatesUseCase(repository);
      },
      inject: ['PropertyCalendarRepositoryPort'],
    },
    {
      provide: BulkUpdatePricingUseCase,
      useFactory: (repository: PropertyCalendarRepositoryAdapter) => {
        return new BulkUpdatePricingUseCase(repository);
      },
      inject: ['PropertyCalendarRepositoryPort'],
    },
    {
      provide: GetAvailabilityRulesUseCase,
      useFactory: (repository: PropertyCalendarRepositoryAdapter) => {
        return new GetAvailabilityRulesUseCase(repository);
      },
      inject: ['PropertyCalendarRepositoryPort'],
    },
    {
      provide: UpdateAvailabilityRulesUseCase,
      useFactory: (repository: PropertyCalendarRepositoryAdapter) => {
        return new UpdateAvailabilityRulesUseCase(repository);
      },
      inject: ['PropertyCalendarRepositoryPort'],
    },
    {
      provide: GetAvailabilitySummaryUseCase,
      useFactory: (calendarRepository, bookingRepository) => {
        return new GetAvailabilitySummaryUseCase(calendarRepository, bookingRepository);
      },
      inject: ['PropertyCalendarRepositoryPort', 'BookingRepositoryPort'],
    },
  ],
  exports: [
    GetPropertyCalendarUseCase,
    UpdateDatePricingUseCase,
    BlockDatesUseCase,
    UnblockDatesUseCase,
    BulkUpdatePricingUseCase,
    GetAvailabilityRulesUseCase,
    UpdateAvailabilityRulesUseCase,
    GetAvailabilitySummaryUseCase,
  ],
})
export class PropertyCalendarModule {}
