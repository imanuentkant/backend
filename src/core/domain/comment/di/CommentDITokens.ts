export class CommentDITokens {
  public static readonly CommentRepository: unique symbol = Symbol('CommentRepository');
  public static readonly CreateCommentUseCase: unique symbol = Symbol('CreateCommentUseCase');
  public static readonly GetPostCommentsUseCase: unique symbol = Symbol('GetPostCommentsUseCase');
}


