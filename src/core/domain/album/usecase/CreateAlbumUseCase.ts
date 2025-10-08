export interface CreateAlbumUseCase {
  execute(port: { executorId: string; postId: string; title: string; description?: string }): Promise<{ id: string; title: string }>;
}

