// src/application/di/PostModule.ts
import { PostController } from '@application/api/http-rest/controller/PostController';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { PostDITokens } from '@core/domain/post/di/PostDITokens';
import { CreatePostUseCase } from '@core/domain/post/usecase/CreatePostUseCase';
import { EditPostUseCase } from '@core/domain/post/usecase/EditPostUseCase';
import { PublishPostUseCase } from '@core/domain/post/usecase/PublishPostUseCase';
import { RemovePostUseCase } from '@core/domain/post/usecase/RemovePostUseCase';
import { HandlePostImageRemovedEventService } from '@core/service/post/handler/HandlePostImageRemovedEventService';
import { CreatePostService } from '@core/service/post/usecase/CreatePostService';
import { EditPostService } from '@core/service/post/usecase/EditPostService';
import { GetPostListService } from '@core/service/post/usecase/GetPostListService';
import { GetPostService } from '@core/service/post/usecase/GetPostService';
import { PublishPostService } from '@core/service/post/usecase/PublishPostService';
import { RemovePostService } from '@core/service/post/usecase/RemovePostService';
import {
  AddPostMediaService,
  RemovePostMediaService,
  ReorderPostMediaService,
  AddPostMediaUseCase,
  RemovePostMediaUseCase,
  ReorderPostMediaUseCase
} from '@core/service/post/usecase/ManagePostMediaService';
import { TypeOrmPostRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/post/TypeOrmPostRepositoryAdapter';
import { NestWrapperPostImageRemovedEventHandler } from '@infrastructure/handler/post/NestWrapperPostImageRemovedEventHandler';
import { TransactionalUseCaseWrapper } from '@infrastructure/transaction/TransactionalUseCaseWrapper';
import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide: PostDITokens.PostRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmPostRepositoryAdapter(dataSource),
    inject: [DataSource]
  }
];

const useCaseProviders: Provider[] = [
  // Existing use cases
  {
    provide: PostDITokens.CreatePostUseCase,
    useFactory: (postRepository, queryBus, asyncPersistence) => {
      const service: CreatePostUseCase = new CreatePostService(postRepository, queryBus, asyncPersistence);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.QueryBus, CoreDITokens.AsyncPersistence]
  },
  {
    provide: PostDITokens.EditPostUseCase,
    useFactory: (postRepository, queryBus, asyncPersistence) => {
      const service: EditPostUseCase = new EditPostService(postRepository, queryBus, asyncPersistence);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.QueryBus, CoreDITokens.AsyncPersistence]
  },
  {
    provide: PostDITokens.GetPostListUseCase,
    useFactory: (postRepository) => new GetPostListService(postRepository),
    inject: [PostDITokens.PostRepository]
  },
  {
    provide: PostDITokens.GetPostUseCase,
    useFactory: (postRepository) => new GetPostService(postRepository),
    inject: [PostDITokens.PostRepository]
  },
  {
    provide: PostDITokens.PublishPostUseCase,
    useFactory: (postRepository, asyncPersistence, queryBus) => {
      const service: PublishPostUseCase = new PublishPostService(postRepository, asyncPersistence, queryBus);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.AsyncPersistence, CoreDITokens.QueryBus]
  },
  {
    provide: PostDITokens.RemovePostUseCase,
    useFactory: (postRepository, asyncPersistence) => {
      const service: RemovePostUseCase = new RemovePostService(postRepository, asyncPersistence);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.AsyncPersistence]
  },

  // New Media Management Use Cases
  {
    provide: PostDITokens.AddPostMediaUseCase,
    useFactory: (postRepository, queryBus, asyncPersistence) => {
      const service: AddPostMediaUseCase = new AddPostMediaService(postRepository, queryBus, asyncPersistence);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.QueryBus, CoreDITokens.AsyncPersistence]
  },
  {
    provide: PostDITokens.RemovePostMediaUseCase,
    useFactory: (postRepository, asyncPersistence) => {
      const service: RemovePostMediaUseCase = new RemovePostMediaService(postRepository, asyncPersistence);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.AsyncPersistence]
  },
  {
    provide: PostDITokens.ReorderPostMediaUseCase,
    useFactory: (postRepository, asyncPersistence) => {
      const service: ReorderPostMediaUseCase = new ReorderPostMediaService(postRepository, asyncPersistence);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [PostDITokens.PostRepository, CoreDITokens.AsyncPersistence]
  }
];

const handlerProviders: Provider[] = [
  {
    provide: NestWrapperPostImageRemovedEventHandler,
    useClass: NestWrapperPostImageRemovedEventHandler,
  },
  {
    provide: PostDITokens.PostImageRemovedEventHandler,
    useFactory: (postRepository) => new HandlePostImageRemovedEventService(postRepository),
    inject: [PostDITokens.PostRepository]
  }
];

@Module({
  controllers: [
    PostController
  ],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders,
    ...handlerProviders,
  ]
})
export class PostModule {}