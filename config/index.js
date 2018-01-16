require('dotenv').config();
config = {};
config.accountSid = process.env.TWILIO_ACCOUNT_SID;
config.authToken = process.env.TWILIO_AUTH_TOKEN;

module.exports = config;