const db = require('../database/queries');
const lib = require('../lib');
const express = require('express');
const router = express.Router();

const verify = (req, res) => {
  
  res.status(200).json({
    results: 'ok'
  });
};


router.post('/verify', verify);

module.exports = router;