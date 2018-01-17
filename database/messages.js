const pg = require('./index.js').pg;
const profileHelpers = require('./profile');

let getTwoUsersByName = (senderName, receiverName) => {
  return profileHelpers.getProfileDataByUsername(senderName)
  .then((senderUser) => {
    return senderUser;
  })
  .then((sendUser) => {
    return profileHelpers.getProfileDataByUsername(receiverName)
    .then((receiverUser) => {
      return {
        sendUser: sendUser[0],
        receiverUser: receiverUser[0]
      }
    });
  });
}

let getAllMessagesBetweenTwoUsers = (firstUser, secondUser) => {
  return getTwoUsersByName(firstUser, secondUser).then((users) => {
    return pg('messages').where({
      sender_id: users.sendUser.id,
      receiver_id: users.receiverUser.id
    })
    .then((messages) => {
      return pg('messages').where({
        sender_id: users.receiverUser.id,
        receiver_id: users.sendUser.id
      }).then((invertedMessages) => {
        return messages.concat(invertedMessages);
      })
    });
  });
}


let storeMessage = (senderUsername, receiverUsername, text) => {
  getTwoUsersByName(senderUsername, receiverUsername)
  .then((users) => {
    pg('messages').insert({
      sender_id: users.sendUser.id,
      receiver_id: users.receiverUser.id,
      chat: text
    }).catch((err) => {
      console.log(err);
    }).then((res) => {
      console.log('message saved!');
    });
  });
}

module.exports = {
  storeMessage: storeMessage,
  getAllMessagesBetweenTwoUsers: getAllMessagesBetweenTwoUsers,
  getTwoUsersByName: getTwoUsersByName 
}