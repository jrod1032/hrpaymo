require('dotenv').config();
const db = require('../database/queries');
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


const youPaid = (user, amount, time) => {
  return `You paid ${user} $${amount} at ${time}. For more info, login to your paymo account.`
}

const youWerePaid = (user, amount, time) => {
  return `${user} paid you $${amount}! For more info, login to your paymo account.`
}

// const requestMsg = () => {}

const messages = {
  // request: requestMsg,
  payer: youPaid,
  payee: youWerePaid
}

const sendSMS = (phoneNumber, message) => {
  client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
    body: message
  }).then((mss) => console.log(mss))
    .catch(err => console.log('Error in twilio message send', err));
}

const sendTransactionNotifications = (transactionId) => {
  db.getTransactionInfo(transactionId)
    .then(dbResults => {
      if (dbResults.payer_verified) {
        let message = messages.payer(dbResults.payer_name, dbResults.amount);
        sendSMS(dbResults.payer_phone, message);
      }
      if (dbResults.payee_verified) {
        let message = messages.payee(dbResults.payee_name, dbResults.amount);
        sendSMS(dbResults.payee_phone, message);
      }
    }).catch(error => console.log('Error: could not retrieve transaction info from database'))
}

module.exports = {
  sendTransactionNotifications: sendTransactionNotifications
}

// sendTransactionNotifications(1)