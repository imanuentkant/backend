import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('messages')
@ApiTags('Messages')
export class MessageController {
  
  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async getConversations(@Req() request: Request) {
    const userId = (request as any).user?.id || 'mock-user-id';
    return {
      success: true,
      data: [
        {
          id: 'conv-1',
          participants: [userId, 'user-2'],
          lastMessage: 'Hello!',
          unreadCount: 2,
          updatedAt: new Date(),
        },
      ],
    };
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  async getConversation(@Param('id') id: string) {
    return {
      success: true,
      data: {
        id,
        participants: ['user-1', 'user-2'],
        messages: [
          {
            id: 'msg-1',
            senderId: 'user-1',
            content: 'Hello!',
            createdAt: new Date(),
          },
        ],
      },
    };
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create conversation' })
  async createConversation(
    @Body() body: { participantIds: string[] },
    @Req() request: Request,
  ) {
    const userId = (request as any).user?.id || 'mock-user-id';
    return {
      success: true,
      data: {
        id: 'new-conv-id',
        participants: [userId, ...body.participantIds],
        createdAt: new Date(),
      },
    };
  }

  @Post('conversations/:id/messages')
  @ApiOperation({ summary: 'Send message' })
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { content: string },
    @Req() request: Request,
  ) {
    const userId = (request as any).user?.id || 'mock-user-id';
    return {
      success: true,
      data: {
        id: 'new-msg-id',
        conversationId,
        senderId: userId,
        content: body.content,
        createdAt: new Date(),
      },
    };
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get conversation messages' })
  async getMessages(
    @Param('id') conversationId: string,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
  ) {
    return {
      success: true,
      data: {
        messages: [
          {
            id: 'msg-1',
            conversationId,
            senderId: 'user-1',
            content: 'Hello!',
            createdAt: new Date(),
          },
        ],
        total: 1,
        limit,
        offset,
      },
    };
  }
}

