export interface AddAlbumMediaUseCase {
  execute(port: { executorId: string; albumId: string; mediaId: string }): Promise<void>;
}

