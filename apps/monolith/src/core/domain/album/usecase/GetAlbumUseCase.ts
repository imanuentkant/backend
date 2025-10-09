export interface GetAlbumUseCase {
  execute(port: { albumId: string }): Promise<{ id: string; postId: string; ownerId: string; title: string; description: string | null; mediaIds: string[]; createdAt: number }>;
}

