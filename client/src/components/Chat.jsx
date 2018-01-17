import React, { Component } from 'react';
import axios from 'axios';
import FriendList from './ChatFriendList.jsx';
import {ChatMessages, ChatBox} from './ChatMessages.jsx';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

const fakeData = [
  {
    friend: {
      username: 'cody', 
      imageUrl: 'image'
    },
    messages: [
      {
        sender: 'cody',
        reciever: 'newguy',
        message: 'Hello newguy'
      },
      {
        sender: 'newguy',
        reciever: 'cody',
        message: 'Hello cody'
      }
    ]
  },
  {
    friend: {
      username: 'cherry', 
      imageUrl: 'image'
    },
    messages: [
      {
        sender: 'cherry',
        reciever: 'blam92',
        message: 'Hello blam92 I am cherry'
      },
      {
        sender: 'blam92',
        reciever: 'cherry',
        message: 'oh hi!'
      }
    ]
  },
  {
    friend: {
      username: 'jarrod', 
      imageUrl: 'image'
    },
    messages: [
      {
        sender: 'blam92',
        reciever: 'jarrod',
        message: 'Hello jarrod! u there?'
      },
      {
        sender: 'jarrod',
        reciever: 'blam92',
        message: 'Hello jarrod! u there?'
      }
    ]
  }
] 

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
      users: [],
      chats: fakeData,
      onlineUsers: [],
      currentChatData: fakeData[0]
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.openChatWithFriend = this.openChatWithFriend.bind(this);
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
      console.log('fake data!', fakeData[0]);
      this.setState({
        users: response.data.usernames
      });
    })
    .catch(err => {
      console.error(err);
    })
  }

  sendMessage(message) {
    socket.emit('chat', {message: message, imageUrl: ''});
  }
  updateChats(messages) {
    this.setState({
      chats: this.state.chats.concat(messages)
    })
  }

  openChatWithFriend(friendUsername) {
    let currentChats = this.state.chats.filter((chat) => {
      return chat.friend.username === friendUsername;
    });
    console.log(currentChats);
    this.setState({
      currentChatData: currentChats[0]
    });
  }

  render() {
    console.log(this.state.currentChatData);
    return (
      <div style={styles.container}>
        <div style={styles.friendList} className="friend-list">
          <FriendList friends={this.state.onlineUsers} 
          users={this.state.users} openChat={this.openChatWithFriend}/>
        </div>
        <div style={styles.chat} className="chat">
          <div style={styles.messageBox} className="messagebox">
            <ChatMessages chats={this.state.currentChatData} 
            userAvatar={this.props.userInfo.avatarUrl} username={this.props.userInfo.username}/>
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