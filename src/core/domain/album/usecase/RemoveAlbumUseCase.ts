export interface RemoveAlbumUseCase {
  execute(port: { executorId: string; albumId: string }): Promise<void>;
}

