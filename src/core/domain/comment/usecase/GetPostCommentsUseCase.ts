export interface GetPostCommentsUseCase {
  execute(port: { postId: string }): Promise<Array<{ id: string; authorId: string; content: string; rating?: number; createdAt: number }>>;
}


