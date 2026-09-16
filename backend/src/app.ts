import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import counselorRoutes from './routes/counselor.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';
import { AIService } from './services/ai.service';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Sockets Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow swagger assets
}));
app.use(cors());
app.use(express.json());

// API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: { error: 'Too many requests from this IP. Please try again later.' }
});
app.use('/api/', limiter);

// Register Router Nodes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Simple Swagger JSON schema definition
app.get('/api/docs', (req, res) => {
  res.json({
    swagger: "2.0",
    info: {
      title: "CareerVerse AI API",
      description: "Cosmic navigation backend routes serving student profiles, psychometric testing, Three.js coordinates, and local fallback AI services.",
      version: "1.0.0"
    },
    paths: {
      "/api/auth/register": { post: { summary: "Register new account" } },
      "/api/auth/login": { post: { summary: "Generate JWT Session" } },
      "/api/student/assessment": { post: { summary: "Submit psychometric test" } },
      "/api/ai/chat": { post: { summary: "Talk to CareerVerse bot" } },
      "/api/ai/simulation/{career}": { get: { summary: "Progress simulator step" } },
      "/api/ai/predict-placement": { post: { summary: "Predict readiness score" } },
      "/api/ai/roadmap": { post: { summary: "Generate 1-3-5 year visual tracks" } }
    }
  });
});

// Socket.io Schedulers
io.on('connection', (socket) => {
  console.log(`📡 Sockets connected: ${socket.id}`);
  
  socket.on('send_message', async (data) => {
    console.log(`📩 Received 'send_message' event on socket ${socket.id}. Data:`, data);
    try {
      const { message, history } = data;
      console.log(`💬 Processing chat message: "${message}" with history length ${history?.length || 0}`);
      
      // Socket messaging triggers the mock counselor chatbot flow
      const response = await AIService.chat([...(history || []), { role: 'user', content: message }]);
      console.log(`🤖 AI Chat response generated successfully: "${response.substring(0, 60)}..."`);
      
      socket.emit('receive_message', { 
        role: 'assistant', 
        content: response,
        timestamp: new Date()
      });
      console.log(`📤 Emitted 'receive_message' back to client.`);
    } catch (err) {
      console.error(`❌ Error in send_message event handler:`, err);
      socket.emit('receive_message', { role: 'assistant', content: '⚠️ Server connection disrupted.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Sockets disconnected: ${socket.id}`);
  });
});

// Root check
app.get('/', (req, res) => {
  res.send('🌌 CareerVerse AI Server is running online!');
});

// Listen
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, async () => {
    console.log(`🌌 Server launched on http://localhost:${PORT}`);
    console.log(`📖 Interactive API specs available at http://localhost:${PORT}/api/docs`);

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        const data = await res.json() as any;
        if (data.models) {
          console.log("🛠️ Available Gemini Models:");
          data.models.forEach((m: any) => console.log(` - ${m.name}`));
        } else {
          console.error("🛠️ Failed to list models:", data);
        }
      } catch (err) {
        console.error("Error querying models list:", err);
      }
    }
  });
});
