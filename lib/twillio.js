// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create authenticated Authy and Twilio API clients
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//user table needs authyId

const verifyNumber = (number, userId) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}



module.exports = {
  verifyNumber: verifyNumber
}