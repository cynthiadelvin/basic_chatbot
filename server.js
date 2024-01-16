const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 1616;

//Run when client connects

io.on('connection', socket => {
    console.log("New Web Socket connection started");

    //To let the current user know
    socket.emit("message", "Welcome to ChatCord!");

    //To let everyone except the current user know
    socket.broadcast.emit('message', 'A user has joined the chat');

    socket.on('disconnect', () => {
        //To let everyone know
        io.emit('message', 'A user has left the chat');
    });

    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

