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
    cors: { origin: "*" }
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
        } else if (type === 'mobile') {
            console.log(`[+] CONTROLLER (MOBILE) CONNECTED: ${socket.id}`);
            if (pcSocketId) socket.emit('status', 'ONLINE');
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

    // Relay Commands from Phone -> PC
    socket.on('command', (data) => {
        if (!authenticatedClients.has(socket.id)) {
            console.log(`[!] UNAUTHORIZED COMMAND ATTEMPT: ${socket.id}`);
            return;
        }

        if (pcSocketId) {
            console.log(`[>] RELAYING COMMAND: ${data.action}`);
            io.to(pcSocketId).emit('execute', data);
        } else {
            console.log(`[X] FAILED: PC NOT CONNECTED`);
        }
    });

    socket.on('disconnect', () => {
        if (socket.id === pcSocketId) {
            console.log(`[!] PC DISCONNECTED`);
            pcSocketId = null;
            io.emit('status', 'OFFLINE');
        }
        authenticatedClients.delete(socket.id);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`\n>>> ARKON RELAY ID: [${PORT}] <<<\n`);
});
