const server = require('../server/app');
let chai = require('chai');
var expect = chai.expect;
let openSocket = require('socket.io-client');
var port = process.env.PORT || 3000;


let onlineUsers = [];
let client;
describe('Chat service', function() {
  before(function() {
    server.listen(port);
  });
  
  beforeEach(function() {
    onlineUsers = [];
    client = openSocket('http://127.0.0.1:3000', {'forceNew': true});
  });

  after(function(done) {
    server.close(done);
  });
  
  it('Should store socketId of connected user', function(done) {
    client.on('user connect', (onlineUsers) => {
      console.log('USER CONNECT, ACTIVE: ', onlineUsers);
      expect(onlineUsers[0].socketId).to.exist
      done();
    });
    client.emit('user connect', {'hi': 'hi'});
  }); 

  it('Should remove user from onlineUsers array when they disconnect', function(done) {
    client.on('chat', (chat) => {
      console.log('disconnect', onlineUsers);
    });

    client.emit('chat', {
      newMessage: 'message',
      receiverInfo: 'friend',
      senderId: 'userId',
      senderUsername: 'username'
    });

    done();
  });
});
