import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-project', (projectId: string) => {
        socket.join(`project:${projectId}`);
        console.log(`User ${socket.id} joined project room: project:${projectId}`);
    });

    socket.on('leave-project', (projectId: string) => {
        socket.leave(`project:${projectId}`);
        console.log(`User ${socket.id} left project room: project:${projectId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Internal endpoint for tRPC API to notify realtime server
app.post('/internal/emit', (req, res) => {
    const { event, roomId, data } = req.body;

    // Simple internal security check (could be enhanced with a shared secret)
    const isInternal = req.ip === '127.0.0.1' || req.ip === '::1';
    if (!isInternal) {
        return res.status(403).send('Forbidden');
    }

    if (roomId) {
        io.to(roomId).emit(event, data);
        console.log(`[Realtime] Emitted ${event} to ${roomId}`);
    } else {
        io.emit(event, data);
        console.log(`[Realtime] Broadcasted ${event}`);
    }

    res.status(200).json({ success: true });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', connections: io.engine.clientsCount });
});

const PORT = process.env.REALTIME_PORT || 3002;

httpServer.listen(PORT, () => {
    console.log(`>>>> Realtime server running on port ${PORT}`);
});
