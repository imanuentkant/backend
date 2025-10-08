import { 
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { UuidGenerator } from '@core/common/util/uuid/UuidGenerator';

/**
 * WebSocket Gateway cho real-time messaging
 * Airbnb-like chat functionality
 */
@NestWebSocketGateway({
  cors: {
    origin: '*', // Configure này trong production
    credentials: true,
  },
  namespace: '/chat',
})
export class MessagingWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(MessagingWebSocketGateway.name);
  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  /**
   * Handle connection
   */
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    
    if (userId) {
      this.userSockets.set(userId, client.id);
      this.logger.log(`User ${userId} connected with socket ${client.id}`);
      
      // Join user to their room
      client.join(`user:${userId}`);
      
      // Notify user is online
      this.server.emit('user:online', { userId, timestamp: new Date() });
    }
  }

  /**
   * Handle disconnection
   */
  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries())
      .find(([_, socketId]) => socketId === client.id)?.[0];
    
    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
      
      // Notify user is offline
      this.server.emit('user:offline', { userId, timestamp: new Date() });
    }
  }

  /**
   * Send message
   */
  @SubscribeMessage('message:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      conversationId: string;
      recipientId: string;
      content: string;
      attachmentUrl?: string;
    },
  ) {
    const userId = client.handshake.query.userId as string;
    
    // Create message
    const message = {
      id: UuidGenerator.generate(),
      conversationId: data.conversationId,
      senderId: userId,
      content: data.content,
      attachmentUrl: data.attachmentUrl,
      isRead: false,
      createdAt: new Date(),
    };

    // Save to database (mock)
    this.logger.log(`Message sent: ${message.id}`);

    // Emit to recipient
    this.server.to(`user:${data.recipientId}`).emit('message:received', message);

    // Emit confirmation to sender
    client.emit('message:sent', {
      tempId: data.conversationId, // Frontend tempId
      message,
    });

    // Update conversation last message time
    this.server.to(`user:${data.recipientId}`).emit('conversation:updated', {
      conversationId: data.conversationId,
      lastMessageAt: message.createdAt,
      unreadCount: 1, // Increment
    });

    return message;
  }

  /**
   * Mark message as read
   */
  @SubscribeMessage('message:read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; conversationId: string },
  ) {
    const userId = client.handshake.query.userId as string;

    // Update message in database (mock)
    this.logger.log(`Message ${data.messageId} marked as read by ${userId}`);

    // Notify sender
    const senderId = 'other-user-id'; // Should get from message
    this.server.to(`user:${senderId}`).emit('message:read', {
      messageId: data.messageId,
      readAt: new Date(),
      readBy: userId,
    });

    return { success: true };
  }

  /**
   * Typing indicator
   */
  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; recipientId: string },
  ) {
    const userId = client.handshake.query.userId as string;

    // Notify recipient
    this.server.to(`user:${data.recipientId}`).emit('typing:started', {
      conversationId: data.conversationId,
      userId,
      timestamp: new Date(),
    });
  }

  /**
   * Typing stopped
   */
  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; recipientId: string },
  ) {
    const userId = client.handshake.query.userId as string;

    this.server.to(`user:${data.recipientId}`).emit('typing:stopped', {
      conversationId: data.conversationId,
      userId,
    });
  }

  /**
   * Join conversation room
   */
  @SubscribeMessage('conversation:join')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.join(`conversation:${data.conversationId}`);
    return { joined: true, conversationId: data.conversationId };
  }

  /**
   * Leave conversation room
   */
  @SubscribeMessage('conversation:leave')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    client.leave(`conversation:${data.conversationId}`);
    return { left: true, conversationId: data.conversationId };
  }

  /**
   * Send message to specific user
   */
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Send message to conversation
   */
  sendToConversation(conversationId: string, event: string, data: any) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}

