import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Card from 'material-ui/Card';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

const FriendItem = (props) => (
  <ListItem
  primaryText={props.username || 'Random User'}
  leftAvatar={<Avatar src={props.imageUrl || ''} />}
  rightIcon={<CommunicationChatBubble />}
  value={props.username}
  onClick={() => props.openChat(props.username)}
  />
);

const FriendList = (props) => {
  const friendItems = props.users.map((username, index) => {
    return <FriendItem username={username} key={index} openChat={props.openChat}/>
  });
  return (
  <Card>
    <List>
      <Subheader>Friend List</Subheader>
      <Divider/>
      {friendItems}
    </List>
  </Card>
  )
}

export default FriendList;