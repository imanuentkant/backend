import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/HttpJwtAuthGuard';
import { v4 as uuid } from 'uuid';

/**
 * Message Controller - Airbnb-like messaging system
 */
@Controller('api/messages')
@ApiTags('Messages')
@UseGuards(HttpJwtAuthGuard)
@ApiBearerAuth()
export class MessageController {
  
  /**
   * Get all conversations for user
   */
  @Get('conversations')
  @ApiOperation({ summary: 'Lấy danh sách conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getConversations(@Req() request: any) {
    const userId = request.user.id;
    
    // Mock data
    return {
      data: [
        {
          id: uuid(),
          property: {
            id: uuid(),
            title: 'Cozy Apartment',
            location: 'Ho Chi Minh City',
            coverPhoto: 'https://via.placeholder.com/400x300',
          },
          participant: {
            id: uuid(),
            name: 'John Doe',
            photo: 'https://via.placeholder.com/150',
            responseRate: 95,
            responseTime: 'within an hour',
          },
          lastMessage: {
            content: 'Thank you for your interest! The apartment is available for those dates.',
            sentAt: '2025-10-08T14:30:00Z',
            isRead: false,
          },
          unreadCount: 2,
          createdAt: '2025-10-07T10:00:00Z',
          updatedAt: '2025-10-08T14:30:00Z',
        },
        {
          id: uuid(),
          property: {
            id: uuid(),
            title: 'Beach House',
            location: 'Da Nang',
            coverPhoto: 'https://via.placeholder.com/400x300',
          },
          participant: {
            id: uuid(),
            name: 'Jane Smith',
            photo: 'https://via.placeholder.com/150',
            responseRate: 98,
            responseTime: 'within a few hours',
          },
          lastMessage: {
            content: 'What time is check-in?',
            sentAt: '2025-10-06T16:20:00Z',
            isRead: true,
          },
          unreadCount: 0,
          createdAt: '2025-10-05T09:00:00Z',
          updatedAt: '2025-10-06T16:20:00Z',
        },
      ],
      meta: {
        total: 2,
        unreadTotal: 2,
      },
    };
  }
  
  /**
   * Get conversation messages
   */
  @Get('conversations/:id')
  @ApiOperation({ summary: 'Lấy messages trong conversation' })
  @ApiResponse({ status: 200, description: 'Conversation messages' })
  async getConversation(@Param('id') id: string, @Req() request: any) {
    // Mock data
    return {
      conversation: {
        id,
        property: {
          id: uuid(),
          title: 'Cozy Apartment in City Center',
          location: 'Ho Chi Minh City, Vietnam',
          pricePerNight: 100,
          coverPhoto: 'https://via.placeholder.com/400x300',
        },
        participant: {
          id: uuid(),
          name: 'John Doe',
          photo: 'https://via.placeholder.com/150',
          role: 'host',
          joinedDate: '2020-01-15',
          responseRate: 95,
          verified: true,
        },
        booking: {
          id: uuid(),
          checkIn: '2025-11-01',
          checkOut: '2025-11-05',
          status: 'confirmed',
        },
      },
      messages: [
        {
          id: uuid(),
          senderId: uuid(),
          senderName: 'You',
          content: 'Hi! Is this property available from Nov 1-5?',
          isRead: true,
          createdAt: '2025-10-07T10:00:00Z',
        },
        {
          id: uuid(),
          senderId: uuid(),
          senderName: 'John Doe',
          content: 'Hi! Yes, it is available for those dates. Would you like to book?',
          isRead: true,
          createdAt: '2025-10-07T10:15:00Z',
        },
        {
          id: uuid(),
          senderId: uuid(),
          senderName: 'You',
          content: 'Great! What time is check-in?',
          isRead: true,
          createdAt: '2025-10-07T10:20:00Z',
        },
        {
          id: uuid(),
          senderId: uuid(),
          senderName: 'John Doe',
          content: 'Check-in is from 2 PM to 10 PM. Let me know if you need late check-in!',
          isRead: false,
          createdAt: '2025-10-08T14:30:00Z',
        },
      ],
    };
  }
  
  /**
   * Send message (REST fallback for WebSocket)
   */
  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Gửi message (REST fallback)' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { content: string; attachmentUrl?: string },
    @Req() request: any,
  ) {
    const senderId = request.user.id;
    
    // Mock response
    const message = {
      id: uuid(),
      conversationId,
      senderId,
      content: body.content,
      attachmentUrl: body.attachmentUrl,
      isRead: false,
      createdAt: new Date(),
    };

    return {
      message,
      status: 'sent',
      deliveredVia: 'rest', // 'websocket' if user online
    };
  }
  
  /**
   * Mark messages as read
   */
  @Put('conversations/:id/read')
  @ApiOperation({ summary: 'Đánh dấu messages đã đọc' })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  async markAsRead(@Param('id') conversationId: string, @Req() request: any) {
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
  @ApiResponse({ status: 201, description: 'Conversation created' })
  async startConversation(
    @Body() body: { propertyId: string; hostId: string; message: string },
    @Req() request: any,
  ) {
    const guestId = request.user.id;
    
    return {
      conversation: {
        id: uuid(),
        propertyId: body.propertyId,
        guestId,
        hostId: body.hostId,
        createdAt: new Date(),
      },
      firstMessage: {
        id: uuid(),
        content: body.message,
        sentAt: new Date(),
      },
    };
  }
  
  /**
   * Get unread count
   */
  @Get('unread-count')
  @ApiOperation({ summary: 'Lấy số messages chưa đọc' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@Req() request: any) {
    return {
      total: 5,
      conversations: [
        { conversationId: uuid(), count: 2 },
        { conversationId: uuid(), count: 3 },
      ],
    };
  }
}

