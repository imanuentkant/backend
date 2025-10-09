export interface RemoveAlbumMediaUseCase {
  execute(port: { executorId: string; albumId: string; mediaId: string }): Promise<void>;
}

