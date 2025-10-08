export interface GetAlbumListUseCase {
  execute(port: { postId: string }): Promise<Array<{ id: string; title: string; description: string | null; mediaCount: number; createdAt: number }>>;
}

