const _ = require('underscore');
module.exports = setSocketListeners = (io) => {
  io.on('connection', (socket) => {
    socket.on('chat', (message) => {
      io.emit('chat', message);
    });
    userEvents(socket, io);
  });
}

let onlineUsers = [];
let userEvents = (socket, io) => {
  socket.on('user connect', (userData) => {
    onlineUsers.push({
      userData: userData,
      socketId: socket.id
    });
    console.log('users connected:', onlineUsers);
    io.emit('user connect', onlineUsers);
  });

  socket.on('disconnect', () => {
    console.log('current socket id disconnected: ', socket.id);
    const indexOfUser = _.findIndex(onlineUsers, (user) => {
      return user.socketId === socket.id;
    });
    onlineUsers.splice(indexOfUser, 1);
    console.log(onlineUsers);
    io.emit('user disconnect', onlineUsers);
  });
}