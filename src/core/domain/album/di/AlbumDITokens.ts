export class AlbumDITokens {
  public static readonly AlbumRepository: unique symbol = Symbol('AlbumRepository');
  public static readonly CreateAlbumUseCase: unique symbol = Symbol('CreateAlbumUseCase');
  public static readonly GetAlbumUseCase: unique symbol = Symbol('GetAlbumUseCase');
  public static readonly GetAlbumListUseCase: unique symbol = Symbol('GetAlbumListUseCase');
  public static readonly AddAlbumMediaUseCase: unique symbol = Symbol('AddAlbumMediaUseCase');
  public static readonly RemoveAlbumMediaUseCase: unique symbol = Symbol('RemoveAlbumMediaUseCase');
  public static readonly RemoveAlbumUseCase: unique symbol = Symbol('RemoveAlbumUseCase');
}

