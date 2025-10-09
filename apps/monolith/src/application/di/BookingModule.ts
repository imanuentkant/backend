import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmBooking } from '@infrastructure/adapter/persistence/typeorm/entity/booking/TypeOrmBooking';
import { BookingRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/BookingRepositoryAdapter';
import { CreateBookingUseCase } from '@core/service/booking/usecase/CreateBookingUseCase';
import { GetBookingUseCase } from '@core/service/booking/usecase/GetBookingUseCase';
import { ConfirmBookingUseCase } from '@core/service/booking/usecase/ConfirmBookingUseCase';
import { CancelBookingUseCase } from '@core/service/booking/usecase/CancelBookingUseCase';
import { ListUserBookingsUseCase } from '@core/service/booking/usecase/ListUserBookingsUseCase';
import { ListHostReservationsUseCase } from '@core/service/booking/usecase/ListHostReservationsUseCase';
import { GetHostDashboardUseCase } from '@core/service/booking/usecase/GetHostDashboardUseCase';
import { GetHostEarningsUseCase } from '@core/service/booking/usecase/GetHostEarningsUseCase';
import { GetHostOccupancyUseCase } from '@core/service/booking/usecase/GetHostOccupancyUseCase';
import { BookingController } from '@application/api/http-rest/controller/BookingController';
import { PropertyModule } from './PropertyModule';

const bookingRepositoryProvider: Provider = {
  provide: 'BookingRepositoryPort',
  useClass: BookingRepositoryAdapter,
};

const createBookingUseCaseProvider: Provider = {
  provide: CreateBookingUseCase,
  useFactory: (bookingRepo: BookingRepositoryAdapter, propertyRepo: any) => 
    new CreateBookingUseCase(bookingRepo, propertyRepo),
  inject: ['BookingRepositoryPort', 'PropertyRepositoryPort'],
};

const getBookingUseCaseProvider: Provider = {
  provide: GetBookingUseCase,
  useFactory: (repository: BookingRepositoryAdapter) => new GetBookingUseCase(repository),
  inject: ['BookingRepositoryPort'],
};

const confirmBookingUseCaseProvider: Provider = {
  provide: ConfirmBookingUseCase,
  useFactory: (repository: BookingRepositoryAdapter) => new ConfirmBookingUseCase(repository),
  inject: ['BookingRepositoryPort'],
};

const cancelBookingUseCaseProvider: Provider = {
  provide: CancelBookingUseCase,
  useFactory: (repository: BookingRepositoryAdapter) => new CancelBookingUseCase(repository),
  inject: ['BookingRepositoryPort'],
};

const listUserBookingsUseCaseProvider: Provider = {
  provide: ListUserBookingsUseCase,
  useFactory: (repository: BookingRepositoryAdapter) => new ListUserBookingsUseCase(repository),
  inject: ['BookingRepositoryPort'],
};

const listHostReservationsUseCaseProvider: Provider = {
  provide: ListHostReservationsUseCase,
  useFactory: (repository: BookingRepositoryAdapter) => new ListHostReservationsUseCase(repository),
  inject: ['BookingRepositoryPort'],
};

const getHostDashboardUseCaseProvider: Provider = {
  provide: GetHostDashboardUseCase,
  useFactory: (bookingRepo: BookingRepositoryAdapter, propertyRepo: any) => 
    new GetHostDashboardUseCase(bookingRepo, propertyRepo),
  inject: ['BookingRepositoryPort', 'PropertyRepositoryPort'],
};

const getHostEarningsUseCaseProvider: Provider = {
  provide: GetHostEarningsUseCase,
  useFactory: (bookingRepo: BookingRepositoryAdapter, propertyRepo: any) => 
    new GetHostEarningsUseCase(bookingRepo, propertyRepo),
  inject: ['BookingRepositoryPort', 'PropertyRepositoryPort'],
};

const getHostOccupancyUseCaseProvider: Provider = {
  provide: GetHostOccupancyUseCase,
  useFactory: (bookingRepo: BookingRepositoryAdapter, propertyRepo: any) => 
    new GetHostOccupancyUseCase(bookingRepo, propertyRepo),
  inject: ['BookingRepositoryPort', 'PropertyRepositoryPort'],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmBooking]),
    PropertyModule,
  ],
  controllers: [BookingController],
  providers: [
    bookingRepositoryProvider,
    createBookingUseCaseProvider,
    getBookingUseCaseProvider,
    confirmBookingUseCaseProvider,
    cancelBookingUseCaseProvider,
    listUserBookingsUseCaseProvider,
    listHostReservationsUseCaseProvider,
    getHostDashboardUseCaseProvider,
    getHostEarningsUseCaseProvider,
    getHostOccupancyUseCaseProvider,
  ],
  exports: [
    'BookingRepositoryPort',
    CreateBookingUseCase,
    GetBookingUseCase,
    ConfirmBookingUseCase,
    CancelBookingUseCase,
    ListUserBookingsUseCase,
    ListHostReservationsUseCase,
    GetHostDashboardUseCase,
    GetHostEarningsUseCase,
    GetHostOccupancyUseCase,
  ],
})
export class BookingModule {}

