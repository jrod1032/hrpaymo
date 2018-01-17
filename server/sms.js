const db = require('../database/queries');
const lib = require('../lib');
const express = require('express');
const router = express.Router();

const authenticate = (req, res) => {
  res.status(200).end()
}

const submitForVerification = (req, res) => {
  console.log('verifying phone number', req.query.p, req.query.uid)
  db.updatePhoneNumber(req.query.p, req.query.uid)
  .then(response => {console.log(response)}).catch(err=>console.log(err))
  // lib.twillio.verifyNumber(req.params.p)
  //   .then(response => {
    //   console.log('phone number verified', response)
    //   res.status(200).json({
    //     verified: response
    //   });
    // })
    // .catch(err => {
    //   console.log(err);
      res.status(500).end();
    // });
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

router.get('/verify', submitForVerification);
router.get('/authenticate/:number', authenticate);
router.get('/userphone/:userId', getUserPhone);

module.exports = router;