const db = require('../database/queries');
const lib = require('../lib');
const express = require('express');
const router = express.Router();

const authenticate = (req, res) => {
  res.status(200).end()
}

const submitForVerification = (req, res) => {
  console.log('verifying phone number', req.params.phoneNumber)
  lib.twillio.verifyNumber(req.params.phoneNumber)
    .then(response => {
      console.log('phone number verified')
      res.status(200).json({
        verified: response
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
};

const getUserPhone = (req, res) => {
  db.getUserPhoneNumber(req.params.userId)
    .then(results => {
      res.status(200).json({
        phone: results
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
};

router.get('/verify/:number', submitForVerification);
router.get('/authenticate/:number', authenticate);
router.get('/userphone/:userId', getUserPhone);

module.exports = router;