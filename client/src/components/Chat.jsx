import React, { Component } from 'react';
import axios from 'axios';
import FriendList from './ChatFriendList.jsx';
import {ChatMessages, ChatBox} from './ChatMessages.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: "'friendList chat'",
    height: '500px'
  },

  friendList: {
    gridArea: 'friendList',
    borderStyle: 'solid',
  },
  chat: {
    display: 'grid',
    gridArea: 'chat',
    borderStyle: 'solid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 100px',
    gridTemplateAreas: "'messageBox' 'chatBox'"
  },
  messageBox: {
    gridArea: 'messageBox',
    borderStyle: 'solid',
  },
  chatBox: {
    gridArea: 'chatBox',
    borderStyle: 'solid',
  }
};

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      usernames: [],
      chats: [{message: 'Hi there', imageUrl: 'randomImg'}, 
      {message: 'Hi there', imageUrl: 'randomImg'}, {message: 'Hi there', imageUrl: 'randomImg'}],
      onlineUsers: []
    }
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    this.getUsers();
    socket.on('chat', (message) => {
      console.log('got a message!', message);
      this.updateChats([message]);
    });
    socket.on('user disconnect', (onlineUsers) => {
      console.log('USER DISCONNECT', onlineUsers);
      this.setState({
        onlineUsers: onlineUsers
      })
    });
    socket.on('user connect', (users) => {
      this.setState({
        onlineUsers: users
      });
    })
    socket.emit('user connect', this.props.userInfo);
  }

  getUsers() {
    axios('/usernames', { params: { userId: this.props.userInfo.userId }})
    .then(response => {
      this.setState({
        usernames: response.data.usernames
      });
    })
    .catch(err => {
      console.error(err);
    })
  }

  sendMessage(message) {
    socket.emit('chat', {message: message, imageUrl: ''});
    // this.setState({
    //   chats: this.state.chats.concat([{message: message, imageUrl: ''}])
    // });
  }
  updateChats(messages) {
    this.setState({
      chats: this.state.chats.concat(messages)
    })
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.friendList} className="friend-list">
          <FriendList friends={this.state.onlineUsers}/>
        </div>
        <div style={styles.chat} className="chat">
          <div style={styles.messageBox} className="messagebox">
            <ChatMessages chats={this.state.chats}/>
          </div>
          <div style={styles.chatBox} className="chatbox">
            <ChatBox sendMessage={this.sendMessage}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat;