export class CoreDITokens {
  
  // Message Bus
  public static readonly CommandBus: unique symbol = Symbol('CommandBus');
  public static readonly QueryBus: unique symbol = Symbol('QueryBus');
  public static readonly EventBus: unique symbol = Symbol('EventBus');
  
  // Persistence
  public static readonly AsyncPersistence: unique symbol = Symbol('AsyncPersistence');
  
  // Logging
  public static readonly AuditLogAsyncAppender: unique symbol = Symbol('AuditLogAsyncAppender');
  
  // File Storage - MỚI
  public static readonly FileStorage: unique symbol = Symbol('FileStorage');
  
}
