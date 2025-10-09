import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CommentController } from '@application/api/http-rest/controller/CommentController';
import { CommentDITokens } from '@core/domain/comment/di/CommentDITokens';
import { CreateCommentUseCase } from '@core/domain/comment/usecase/CreateCommentUseCase';
import { GetPostCommentsUseCase } from '@core/domain/comment/usecase/GetPostCommentsUseCase';
import { CreateCommentService, GetPostCommentsService } from '@core/service/comment/usecase/CommentServices';
import { TypeOrmCommentRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/comment/TypeOrmCommentRepositoryAdapter';

const persistenceProviders: Provider[] = [
  {
    provide: CommentDITokens.CommentRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmCommentRepositoryAdapter(dataSource),
    inject: [DataSource]
  }
];

const useCaseProviders: Provider[] = [
  {
    provide: CommentDITokens.CreateCommentUseCase,
    useFactory: (repo) => new CreateCommentService(repo),
    inject: [CommentDITokens.CommentRepository]
  },
  {
    provide: CommentDITokens.GetPostCommentsUseCase,
    useFactory: (repo) => new GetPostCommentsService(repo),
    inject: [CommentDITokens.CommentRepository]
  }
];

@Module({
  controllers: [CommentController],
  providers: [
    ...persistenceProviders,
    ...useCaseProviders
  ]
})
export class CommentModule {}


