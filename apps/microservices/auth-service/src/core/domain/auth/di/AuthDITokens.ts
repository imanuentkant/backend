export class AuthDITokens {
  // Use Cases
  public static readonly CreateUserUseCase: unique symbol = Symbol('CreateUserUseCase');
  public static readonly LoginUseCase: unique symbol = Symbol('LoginUseCase');
  public static readonly RefreshTokenUseCase: unique symbol = Symbol('RefreshTokenUseCase');
  public static readonly GetUserUseCase: unique symbol = Symbol('GetUserUseCase');

  // Repositories
  public static readonly UserRepository: unique symbol = Symbol('UserRepository');
  public static readonly RefreshTokenRepository: unique symbol = Symbol('RefreshTokenRepository');
}

