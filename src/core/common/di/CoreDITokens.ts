export class CoreDITokens {
  
  // CQERS
  
  public static readonly CommandBus: unique symbol = Symbol('CommandBus');
  public static readonly QueryBus: unique symbol   = Symbol('QueryBus');
  public static readonly EventBus: unique symbol   = Symbol('EventBus');
  
  // Logger
  public static readonly AuditLogAsyncAppender: unique symbol = Symbol('AuditLogAsyncAppender');

  // Async persistence
  public static readonly AsyncPersistence: unique symbol = Symbol('AsyncPersistence');
  
}
