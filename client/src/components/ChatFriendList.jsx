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
  />
);

const FriendList = (props) => {
  const friendItems = props.friends.map((u, index) => {
    return <FriendItem username={u.userData.username} key={index}/>
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