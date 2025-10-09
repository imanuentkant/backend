import { UserController } from '@application/api/http-rest/controller/UserController';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { HandleGetUserPreviewQueryService } from '@core/service/user/handler/HandleGetUserPreviewQueryService';
import { CreateUserService } from '@core/service/user/usecase/CreateUserService';
import { GetUserService } from '@core/service/user/usecase/GetUserService';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/user/TypeOrmUserRepositoryAdapter';
import { NestWrapperGetUserPreviewQueryHandler } from '@infrastructure/handler/user/NestWrapperGetUserPreviewQueryHandler';
import { Module, Provider } from '@nestjs/common';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { DataSource } from 'typeorm';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/TypeOrmUser';
import {AuthModule} from "@application/di/AuthModule";

const persistenceProviders: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmUserRepositoryAdapter(dataSource.getRepository(TypeOrmUser)),
    inject: [DataSource]
  }
];

const useCaseProviders: Provider[] = [
  {
    provide   : UserDITokens.CreateUserUseCase,
    useFactory: (userRepository, asyncPersistence) => new CreateUserService(userRepository, asyncPersistence),
    inject    : [UserDITokens.UserRepository, CoreDITokens.AsyncPersistence]
  },
  {
    provide   : UserDITokens.GetUserUseCase,
    useFactory: (userRepository) => new GetUserService(userRepository),
    inject    : [UserDITokens.UserRepository]
  },
];

const handlerProviders: Provider[] = [
  NestWrapperGetUserPreviewQueryHandler,
  {
    provide   : UserDITokens.GetUserPreviewQueryHandler,
    useFactory: (userRepository) => new HandleGetUserPreviewQueryService(userRepository),
    inject    : [UserDITokens.UserRepository]
  }
];

@Module({
  imports: [
    // đảm bảo provider Global đã sẵn sàng
    // (InfrastructureModule đã @Global nhưng import thêm để chắc scope)
  ],
  controllers: [
    UserController
  ],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...handlerProviders,
  ],
  exports: [
    UserDITokens.UserRepository
  ]
})
export class UserModule {}
