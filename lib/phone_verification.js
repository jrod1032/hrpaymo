const Client = require('authy-client').Client;
const enums = require('authy-client').enums;
// const authy = new Client({ key: process.env.ACCOUNT_SECURITY_API_KEY });
const authy = new Client({ key: process.env.TEST_SECURITY_API_KEY }, { host: 'https://sandbox-api.authy.com'});

module.exports.requestPhoneVerification = (phone_number, country_code) => {
  return new Promise((resolve, reject) => {
    authy.startPhoneVerification({ 
      phone: phone_number, 
      countryCode: country_code, 
      locale: 'en', 
      via: enums.verificationVia.SMS 
    },(err, res) => {
      if (err) {
        console.log('request error', err)
        reject(err);
      } else {
        console.log('request success', res)
        resolve(res);
      }
    })
  });
}

module.exports.verifyPhoneToken = (phone_number, country_code, token) => {
  return new Promise((resolve, reject) => {
    authy.verifyPhone({ 
      countryCode: country_code, 
      phone: phone_number, 
      token: token
    }, (err, res) => {
      if (err) {
        console.log('verify error', err)
        reject(err);
      } else {
        console.log('verify success', res)
        resolve(res);
      }
    });
  });
}
