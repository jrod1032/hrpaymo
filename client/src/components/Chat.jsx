import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Card from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

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

const FriendItem = (props) => (
  <ListItem
  primaryText={props.name || 'Random User'}
  leftAvatar={<Avatar src={props.imageUrl || ''} />}
  rightIcon={<CommunicationChatBubble />}
  />
);

const FriendList = () => {
  // let friends = props.friendList..
  return (
  <Card>
    <List>
      <Subheader>Friend List</Subheader>
      <Divider/>
      <FriendItem/>
    </List>
  </Card>
  )
}

class Chat extends Component {

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.friendList} className="friend-list">
          <FriendList/>
        </div>
        <div style={styles.chat} className="chat">
          <div style={styles.messageBox} className="messagebox">

          </div>
          <div style={styles.chatBox} className="chatbox">
          </div>
        </div>
      </div>
    )
  }
}

export default Chat;