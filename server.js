const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

let players = {};
let currentVideo = "dQw4w9WgXcQ"; // Default video

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    players[socket.id] = { x: 200 };

    socket.emit('currentPlayers', players);
    socket.emit('videoChange', { videoId: currentVideo });

    socket.on('move', (data) => {
        players[socket.id].x = data.x;
        io.emit('playerMoved', { id: socket.id, x: data.x });
    });

    socket.on('videoChange', (data) => {
        currentVideo = data.videoId;
        io.emit('videoChange', { videoId: data.videoId });
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});