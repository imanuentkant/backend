export interface CreateCommentUseCase {
  execute(port: { executorId: string; postId: string; content: string; rating?: number }): Promise<{ id: string }>;
}


