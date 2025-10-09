# 💬 Message Service

Microservice for real-time messaging & conversations.

## Features

- ✅ Real-time messaging (WebSocket)
- ✅ Conversation management
- ✅ Group chats
- ✅ Read receipts
- ✅ Typing indicators
- ✅ Message history
- ✅ Kafka events integration

## API Endpoints

### Conversations
- `GET /messages/conversations` - List conversations
- `GET /messages/conversations/:id` - Get conversation
- `POST /messages/conversations` - Create conversation

### Messages
- `GET /messages/conversations/:id/messages` - Get messages
- `POST /messages/conversations/:id/messages` - Send message
- `PUT /messages/:id` - Edit message
- `DELETE /messages/:id` - Delete message

### WebSocket Events
- `message.sent` - New message
- `typing.start` - User typing
- `typing.stop` - User stopped typing
- `message.read` - Message read

## Quick Start

```bash
npm install
npm run start:dev
```

## Environment

```env
PORT=3006
DB_HOST=localhost
DB_DATABASE=message_db
KAFKA_BROKERS=localhost:19092
```

## Docker

```bash
docker build -t message-service .
docker run -p 3006:3006 message-service
```

**Status:** ✅ Ready for production

