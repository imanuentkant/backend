import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { GetUserConversationsUseCase } from '@core/service/message/usecase/GetUserConversationsUseCase';
import { GetConversationMessagesUseCase } from '@core/service/message/usecase/GetConversationMessagesUseCase';
import { SendMessageUseCase } from '@core/service/message/usecase/SendMessageUseCase';
import { StartConversationUseCase } from '@core/service/message/usecase/StartConversationUseCase';
import { MarkMessagesAsReadUseCase } from '@core/service/message/usecase/MarkMessagesAsReadUseCase';
import {
  ListConversationsResponseDto,
  GetConversationResponseDto,
  SendMessageResponseDto,
  StartConversationResponseDto,
  UnreadCountResponseDto,
  MarkAsReadResponseDto,
} from '@application/api/http-rest/dto/message/MessageResponseDto';
import { BookableItemType } from '@core/common/entity/BookableItem';

/**
 * Message Controller - Airbnb-like messaging system
 */
@Controller('api/messages')
@ApiTags('Messages')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class MessageController {
  
  constructor(
    private readonly getUserConversationsUseCase: GetUserConversationsUseCase,
    private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly startConversationUseCase: StartConversationUseCase,
    private readonly markMessagesAsReadUseCase: MarkMessagesAsReadUseCase,
  ) {}
  
  /**
   * Get all conversations for user
   */
  @Get('conversations')
  @ApiOperation({ summary: 'Lấy danh sách conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations', type: ListConversationsResponseDto })
  async getConversations(
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<ListConversationsResponseDto> {
    const userId = request.user.id;
    
    const conversations = await this.getUserConversationsUseCase.execute({ userId });
    
    // TODO: Fetch property/vehicle details and user details
    // For now, return basic conversation data
    const totalUnread = conversations.reduce((sum, c) => sum + c.getUnreadCount(), 0);
    
    return {
      data: conversations.map(conv => ({
        id: conv.getId(),
        bookableType: conv.getBookableType(),
        bookableId: conv.getBookableId(),
        property: undefined, // TODO: Fetch property details
        participant: {
          id: conv.getGuestId() === userId ? conv.getHostId() : conv.getGuestId(),
          name: 'User', // TODO: Fetch user details
          photo: 'https://via.placeholder.com/150',
        },
        lastMessage: {
          content: 'Last message', // TODO: Fetch last message
          sentAt: conv.getLastMessageAt() || conv.getCreatedAt(),
          isRead: false,
        },
        unreadCount: conv.getUnreadCount(),
        createdAt: conv.getCreatedAt(),
        updatedAt: conv.getUpdatedAt(),
      })),
      meta: {
        total: conversations.length,
        unreadTotal: totalUnread,
      },
    };
  }
  
  /**
   * Get conversation messages
   */
  @Get('conversations/:id')
  @ApiOperation({ summary: 'Lấy messages trong conversation' })
  @ApiResponse({ status: 200, description: 'Conversation messages', type: GetConversationResponseDto })
  async getConversation(
    @Param('id') id: string,
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<GetConversationResponseDto> {
    const userId = request.user.id;
    
    const messages = await this.getConversationMessagesUseCase.execute({ conversationId: id });
    
    // TODO: Fetch conversation details, property, participant
    return {
      conversation: {
        id,
        property: {
          id: 'property-id',
          title: 'Property Title', // TODO: Fetch real data
          location: 'Location',
          coverPhoto: 'https://via.placeholder.com/400x300',
        },
        participant: {
          id: 'participant-id',
          name: 'User Name', // TODO: Fetch real data
          photo: 'https://via.placeholder.com/150',
        },
      },
      messages: messages.map(msg => ({
        id: msg.getId(),
        senderId: msg.getSenderId(),
        senderName: msg.getSenderId() === userId ? 'You' : 'User', // TODO: Fetch names
        content: msg.getContent(),
        attachmentUrl: msg.getAttachmentUrl(),
        isRead: msg.getIsRead(),
        readAt: msg.getReadAt(),
        createdAt: msg.getCreatedAt(),
      })),
    };
  }
  
  /**
   * Send message (REST fallback for WebSocket)
   */
  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Gửi message (REST fallback)' })
  @ApiResponse({ status: 201, description: 'Message sent', type: SendMessageResponseDto })
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { content: string; attachmentUrl?: string },
    @Req() request: Express.Request & { user: { id: string } },
  ): Promise<SendMessageResponseDto> {
    const senderId = request.user.id;
    
    const message = await this.sendMessageUseCase.execute({
      conversationId,
      senderId,
      content: body.content,
      attachmentUrl: body.attachmentUrl,
    });

    return {
      message: {
        id: message.getId(),
        senderId: message.getSenderId(),
        senderName: 'You',
        content: message.getContent(),
        attachmentUrl: message.getAttachmentUrl(),
        isRead: message.getIsRead(),
        readAt: message.getReadAt(),
        createdAt: message.getCreatedAt(),
      },
      status: 'sent',
      deliveredVia: 'rest',
    };
  }
  
  /**
   * Mark messages as read
   */
  @Put('conversations/:id/read')
  @ApiOperation({ summary: 'Đánh dấu messages đã đọc' })
  @ApiResponse({ status: 200, description: 'Messages marked as read', type: MarkAsReadResponseDto })
  async markAsRead(
    @Param('id') conversationId: string,
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<MarkAsReadResponseDto> {
    const userId = request.user.id;
    
    await this.markMessagesAsReadUseCase.execute({ conversationId, userId });
    
    return {
      conversationId,
      markedAt: new Date(),
      unreadCount: 0,
    };
  }
  
  /**
   * Start new conversation
   */
  @Post('conversations')
  @ApiOperation({ summary: 'Bắt đầu conversation mới' })
  @ApiResponse({ status: 201, description: 'Conversation created', type: StartConversationResponseDto })
  async startConversation(
    @Body() body: { 
      bookableType?: BookableItemType;
      bookableId?: string;
      propertyId?: string; // Backward compatibility
      hostId: string; 
      message: string;
    },
    @Req() request: Express.Request & { user: { id: string } },
  ): Promise<StartConversationResponseDto> {
    const guestId = request.user.id;
    
    const result = await this.startConversationUseCase.execute({
      bookableType: body.bookableType || BookableItemType.PROPERTY,
      bookableId: body.bookableId || body.propertyId!,
      propertyId: body.propertyId,
      guestId,
      hostId: body.hostId,
      initialMessage: body.message,
    });
    
    return {
      conversation: {
        id: result.conversation.getId(),
        bookableType: result.conversation.getBookableType(),
        bookableId: result.conversation.getBookableId(),
        propertyId: result.conversation.getPropertyId(),
        guestId: result.conversation.getGuestId(),
        hostId: result.conversation.getHostId(),
        createdAt: result.conversation.getCreatedAt(),
      },
      firstMessage: {
        id: result.firstMessage.getId(),
        content: result.firstMessage.getContent(),
        sentAt: result.firstMessage.getCreatedAt(),
      },
    };
  }
  
  /**
   * Get unread count
   */
  @Get('unread-count')
  @ApiOperation({ summary: 'Lấy số messages chưa đọc' })
  @ApiResponse({ status: 200, description: 'Unread count', type: UnreadCountResponseDto })
  async getUnreadCount(
    @Req() request: Express.Request & { user: { id: string } }
  ): Promise<UnreadCountResponseDto> {
    const userId = request.user.id;
    
    const conversations = await this.getUserConversationsUseCase.execute({ userId });
    const conversationsWithUnread = conversations.filter(c => c.getUnreadCount() > 0);
    
    return {
      total: conversations.reduce((sum, c) => sum + c.getUnreadCount(), 0),
      conversations: conversationsWithUnread.map(c => ({
        conversationId: c.getId(),
        count: c.getUnreadCount(),
      })),
    };
  }
}

