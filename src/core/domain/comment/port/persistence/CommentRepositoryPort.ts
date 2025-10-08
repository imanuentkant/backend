export interface CommentRepositoryPort {
  insert(entity: { id: string; postId: string; authorId: string; content: string; rating?: number; createdAt: Date }): Promise<void>;
  findByPostId(postId: string): Promise<Array<{ id: string; postId: string; authorId: string; content: string; rating?: number; createdAt: Date }>>;
}


