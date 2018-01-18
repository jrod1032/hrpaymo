const _ = require('underscore');
module.exports = setSocketListeners = (io) => {
  io.on('connection', (socket) => {
    chatEvents(socket, io);
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
    const indexOfUser = _.findIndex(onlineUsers, (user) => {
      return user.socketId === socket.id;
    });
    onlineUsers.splice(indexOfUser, 1);
    io.emit('user disconnect', onlineUsers);
  });
}

let getUserSocketId = (array, userId) => {
  let socketId = null;
  array.forEach((val, index) => {
    if(val.userData.userId === userId) {
      socketId = val.socketId;
      return;
    }
  });
  return socketId;
}

let chatEvents = (socket, io) => {
  socket.on('chat', (chatData) => {
    console.log('received chat event', chatData);
    const socketId = getUserSocketId(onlineUsers, chatData.receiverInfo.id);
    if(socketId) {
      socket.broadcast.to(socketId).emit('chat', {
        message: chatData.newMessage,
        friendId: chatData.senderId,
        friendUsername: chatData.senderUsername
      });
    }
  });
}