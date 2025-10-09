import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AlbumController } from '@application/api/http-rest/controller/AlbumController';
import { AlbumDITokens } from '@core/domain/album/di/AlbumDITokens';
import { CreateAlbumUseCase } from '@core/domain/album/usecase/CreateAlbumUseCase';
import { GetAlbumUseCase } from '@core/domain/album/usecase/GetAlbumUseCase';
import { GetAlbumListUseCase } from '@core/domain/album/usecase/GetAlbumListUseCase';
import { AddAlbumMediaUseCase } from '@core/domain/album/usecase/AddAlbumMediaUseCase';
import { RemoveAlbumMediaUseCase } from '@core/domain/album/usecase/RemoveAlbumMediaUseCase';
import { RemoveAlbumUseCase } from '@core/domain/album/usecase/RemoveAlbumUseCase';
import { CreateAlbumService } from '@core/service/album/usecase/CreateAlbumService';
import { GetAlbumService } from '@core/service/album/usecase/GetAlbumService';
import { GetAlbumListService } from '@core/service/album/usecase/GetAlbumListService';
import { AddAlbumMediaService } from '@core/service/album/usecase/AddAlbumMediaService';
import { RemoveAlbumMediaService } from '@core/service/album/usecase/RemoveAlbumMediaService';
import { RemoveAlbumService } from '@core/service/album/usecase/RemoveAlbumService';
import { TypeOrmAlbumRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/album/TypeOrmAlbumRepositoryAdapter';

const persistenceProviders: Provider[] = [
  {
    provide: AlbumDITokens.AlbumRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmAlbumRepositoryAdapter(dataSource),
    inject: [DataSource]
  }
];

const useCaseProviders: Provider[] = [
  {
    provide: AlbumDITokens.CreateAlbumUseCase,
    useFactory: (repo) => new CreateAlbumService(repo),
    inject: [AlbumDITokens.AlbumRepository]
  },
  {
    provide: AlbumDITokens.GetAlbumUseCase,
    useFactory: (repo) => new GetAlbumService(repo),
    inject: [AlbumDITokens.AlbumRepository]
  },
  {
    provide: AlbumDITokens.GetAlbumListUseCase,
    useFactory: (repo) => new GetAlbumListService(repo),
    inject: [AlbumDITokens.AlbumRepository]
  },
  {
    provide: AlbumDITokens.AddAlbumMediaUseCase,
    useFactory: (repo) => new AddAlbumMediaService(repo),
    inject: [AlbumDITokens.AlbumRepository]
  },
  {
    provide: AlbumDITokens.RemoveAlbumMediaUseCase,
    useFactory: (repo) => new RemoveAlbumMediaService(repo),
    inject: [AlbumDITokens.AlbumRepository]
  },
  {
    provide: AlbumDITokens.RemoveAlbumUseCase,
    useFactory: (repo) => new RemoveAlbumService(repo),
    inject: [AlbumDITokens.AlbumRepository]
  }
];

@Module({
  controllers: [AlbumController],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders
  ]
})
export class AlbumModule {}

