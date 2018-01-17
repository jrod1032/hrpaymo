// const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create authenticated Authy and Twilio API clients
// const authy = require('authy')(config.authyKey);
// const twilioClient = require('twilio')(config.accountSid, config.authToken);

//user table needs authyId

const verifyNumber = (number, userId) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
}



module.exports = {
  verifyNumber: verifyNumber
}