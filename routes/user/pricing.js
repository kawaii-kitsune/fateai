const express = require('express');
const router = express.Router();
// const connection = require('../../database/database');

router.get('/', (req, res) => {

        res.render('pricing');
      });

module.exports = router;