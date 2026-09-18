import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import tokenBlacklist from './tokenBlacklist.service.js';
import chatService from './chat.service.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication Middleware for Sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      
      if (decoded.jti) {
        const isBlacklisted = await tokenBlacklist.isAccessTokenBlacklisted(decoded.jti);
        if (isBlacklisted) {
          return next(new Error('Authentication error: Token revoked'));
        }
      }

      const user = await User.findById(decoded.sub);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.error('Socket authentication failed:', err.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.user._id} (Socket ID: ${socket.id})`);

    // Join a specific session room to receive updates for that session
    socket.on('join_session', (sessionId) => {
      if (sessionId) {
        socket.join(sessionId);
        console.log(`[Socket] User ${socket.user._id} joined session ${sessionId}`);
      }
    });

    // Handle incoming chat messages
    socket.on('send_message', async (data) => {
      try {
        const { message, sessionId, language, context } = data;
        
        // Let the client know we're processing
        socket.emit('message_status', { status: 'processing', sessionId });

        // Process chat via AI service
        const result = await chatService.processChat({
          userId: socket.user._id,
          sessionId,
          message,
          language: language || socket.user.preferredLanguage || 'auto',
          context
        });

        // Emit response back to the specific session room, or directly to socket if no session ID was originally provided
        const targetSessionId = result.sessionId; 
        
        // Ensure socket is in the room (in case it was a new session)
        socket.join(targetSessionId);

        // Emit the final message response
        io.to(targetSessionId).emit('message_response', result);
        
      } catch (error) {
        console.error('[Socket] Error processing message:', error);
        socket.emit('message_error', { 
          message: error.message || 'An error occurred while processing your message' 
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user._id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

export default {
  initSocket,
  getIo
};
