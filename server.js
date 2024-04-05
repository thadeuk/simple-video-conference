const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const users = {}; // Mapping of socket.id => username

const PORT = process.env.PORT || 8000;

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join room', (roomId, username) => {
    console.log('User joined room', roomId, username);
    users[socket.id] = username;
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(roomId);
    const usersInRoom = Array.from(room || []).filter(id => id !== socket.id);
    // Create an array of objects representing the users already in the room
    const usersWithNames = usersInRoom.map(id => ({ id, username: users[id] }));
    console.log(usersInRoom, usersWithNames);

    socket.join(roomId);
    // Broadcasting to all other users in the room
    if (room) {
      socket.broadcast.to(roomId).emit('user joined', {
        callerID: socket.id,
        signal: null, // This will be populated by the client's signal
        username,
      });
    }

    // Sending back all users in the room except the one who just joined
    socket.emit('all users', usersWithNames);
  });

  socket.on('sending signal', payload => {
    io.to(payload.userToSignal).emit('user joined', {
      callerID: payload.callerID,
      signal: payload.signal,
    });
  });

  socket.on('returning signal', payload => {
    io.to(payload.callerID).emit('receiving returned signal', {
      id: socket.id,
      signal: payload.signal,
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

