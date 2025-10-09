import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConversation } from '@infrastructure/adapter/persistence/typeorm/entity/message/TypeOrmConversation';
import { TypeOrmMessage } from '@infrastructure/adapter/persistence/typeorm/entity/message/TypeOrmMessage';
import { ConversationRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/ConversationRepositoryAdapter';
import { MessageRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/MessageRepositoryAdapter';
import { GetUserConversationsUseCase } from '@core/service/message/usecase/GetUserConversationsUseCase';
import { GetConversationMessagesUseCase } from '@core/service/message/usecase/GetConversationMessagesUseCase';
import { SendMessageUseCase } from '@core/service/message/usecase/SendMessageUseCase';
import { StartConversationUseCase } from '@core/service/message/usecase/StartConversationUseCase';
import { MarkMessagesAsReadUseCase } from '@core/service/message/usecase/MarkMessagesAsReadUseCase';
import { MessageController } from '@application/api/http-rest/controller/MessageController';

// Real TypeORM repository adapters
const conversationRepositoryProvider: Provider = {
  provide: 'ConversationRepositoryPort',
  useClass: ConversationRepositoryAdapter,
};

const messageRepositoryProvider: Provider = {
  provide: 'MessageRepositoryPort',
  useClass: MessageRepositoryAdapter,
};

const getUserConversationsUseCaseProvider: Provider = {
  provide: GetUserConversationsUseCase,
  useFactory: (repository: any) => new GetUserConversationsUseCase(repository),
  inject: ['ConversationRepositoryPort'],
};

const getConversationMessagesUseCaseProvider: Provider = {
  provide: GetConversationMessagesUseCase,
  useFactory: (repository: any) => new GetConversationMessagesUseCase(repository),
  inject: ['MessageRepositoryPort'],
};

const sendMessageUseCaseProvider: Provider = {
  provide: SendMessageUseCase,
  useFactory: (messageRepo: any, convRepo: any) => 
    new SendMessageUseCase(messageRepo, convRepo),
  inject: ['MessageRepositoryPort', 'ConversationRepositoryPort'],
};

const startConversationUseCaseProvider: Provider = {
  provide: StartConversationUseCase,
  useFactory: (convRepo: any, messageRepo: any) => 
    new StartConversationUseCase(convRepo, messageRepo),
  inject: ['ConversationRepositoryPort', 'MessageRepositoryPort'],
};

const markMessagesAsReadUseCaseProvider: Provider = {
  provide: MarkMessagesAsReadUseCase,
  useFactory: (messageRepo: any, convRepo: any) => 
    new MarkMessagesAsReadUseCase(messageRepo, convRepo),
  inject: ['MessageRepositoryPort', 'ConversationRepositoryPort'],
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmConversation, TypeOrmMessage]),
  ],
  controllers: [MessageController],
  providers: [
    conversationRepositoryProvider,
    messageRepositoryProvider,
    getUserConversationsUseCaseProvider,
    getConversationMessagesUseCaseProvider,
    sendMessageUseCaseProvider,
    startConversationUseCaseProvider,
    markMessagesAsReadUseCaseProvider,
  ],
  exports: [
    'ConversationRepositoryPort',
    'MessageRepositoryPort',
    GetUserConversationsUseCase,
    GetConversationMessagesUseCase,
    SendMessageUseCase,
    StartConversationUseCase,
    MarkMessagesAsReadUseCase,
  ],
})
export class MessageModule {}

