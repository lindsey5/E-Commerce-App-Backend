import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'

let socketInstance;

const initializeSocket = (server) => {
    const origin = [
        'http://localhost:5173',
        'http://localhost:5174',
        'exp://192.168.1.3:8081',
        'http://localhost:8081'
    ];

    const io = new Server(server, {
        cors: { 
        origin,
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
        }
    });
    
    const userSocketMap = new Map();

    io.on('connection', (socket) => {
       const token = socket.handshake.auth.token;

       socket.on('disconnect', () => {
            socketInstance = undefined
            console.log('User disconnected:', socket.id);
        });
    
        if (!token) {
            console.log('No JWT token found');
            socket.disconnect(); 
            return;
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decodedToken;
            userSocketMap.set(socket.user.id, socket.id);
            

        } catch (err) {
            console.log('Error verifying token:', err.message);
            socket.disconnect(); 
        }

        socketInstance = socket;
    });
}

 export { initializeSocket, socketInstance };