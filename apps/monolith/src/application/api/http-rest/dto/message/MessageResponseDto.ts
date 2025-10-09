import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookableItemType } from '@core/common/entity/BookableItem';

/**
 * Message item
 */
export class MessageItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  senderId: string;
  
  @ApiProperty()
  senderName: string;
  
  @ApiProperty()
  content: string;
  
  @ApiPropertyOptional()
  attachmentUrl?: string;
  
  @ApiProperty()
  isRead: boolean;
  
  @ApiPropertyOptional()
  readAt?: Date;
  
  @ApiProperty()
  createdAt: Date;
}

/**
 * Last message info
 */
export class LastMessageDto {
  @ApiProperty()
  content: string;
  
  @ApiProperty()
  sentAt: Date;
  
  @ApiProperty()
  isRead: boolean;
}

/**
 * Participant info
 */
export class ParticipantDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  photo: string;
  
  @ApiPropertyOptional()
  responseRate?: number;
  
  @ApiPropertyOptional()
  responseTime?: string;
}

/**
 * Property info in conversation
 */
export class ConversationPropertyDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  title: string;
  
  @ApiProperty()
  location: string;
  
  @ApiProperty()
  coverPhoto: string;
}

/**
 * Conversation list item
 */
export class ConversationListItemDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty({ enum: BookableItemType })
  bookableType: BookableItemType;
  
  @ApiProperty()
  bookableId: string;
  
  @ApiPropertyOptional({ type: ConversationPropertyDto })
  property?: ConversationPropertyDto;
  
  @ApiProperty({ type: ParticipantDto })
  participant: ParticipantDto;
  
  @ApiProperty({ type: LastMessageDto })
  lastMessage: LastMessageDto;
  
  @ApiProperty()
  unreadCount: number;
  
  @ApiProperty()
  createdAt: Date;
  
  @ApiProperty()
  updatedAt: Date;
}

/**
 * List conversations response
 */
export class ListConversationsResponseDto {
  @ApiProperty({ type: [ConversationListItemDto] })
  data: ConversationListItemDto[];
  
  @ApiProperty({ type: Object })
  meta: {
    total: number;
    unreadTotal: number;
  };
}

/**
 * Conversation detail
 */
export class ConversationDetailDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty({ type: ConversationPropertyDto })
  property: ConversationPropertyDto;
  
  @ApiProperty({ type: ParticipantDto })
  participant: ParticipantDto;
  
  @ApiPropertyOptional({ type: Object })
  booking?: {
    id: string;
    checkIn: string;
    checkOut: string;
    status: string;
  };
}

/**
 * Get conversation response
 */
export class GetConversationResponseDto {
  @ApiProperty({ type: ConversationDetailDto })
  conversation: ConversationDetailDto;
  
  @ApiProperty({ type: [MessageItemDto] })
  messages: MessageItemDto[];
}

/**
 * Send message response
 */
export class SendMessageResponseDto {
  @ApiProperty({ type: MessageItemDto })
  message: MessageItemDto;
  
  @ApiProperty()
  status: string;
  
  @ApiProperty()
  deliveredVia: string;
}

/**
 * Start conversation response
 */
export class StartConversationResponseDto {
  @ApiProperty({ type: Object })
  conversation: {
    id: string;
    bookableType: BookableItemType;
    bookableId: string;
    propertyId?: string;
    guestId: string;
    hostId: string;
    createdAt: Date;
  };
  
  @ApiProperty({ type: Object })
  firstMessage: {
    id: string;
    content: string;
    sentAt: Date;
  };
}

/**
 * Unread count response
 */
export class UnreadCountResponseDto {
  @ApiProperty()
  total: number;
  
  @ApiProperty({ type: [Object] })
  conversations: Array<{
    conversationId: string;
    count: number;
  }>;
}

/**
 * Mark as read response
 */
export class MarkAsReadResponseDto {
  @ApiProperty()
  conversationId: string;
  
  @ApiProperty()
  markedAt: Date;
  
  @ApiProperty()
  unreadCount: number;
}

