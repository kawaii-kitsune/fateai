const express = require('express');
const router = express.Router();
// const connection = require('../../database/database');

router.get('/', (req, res) => {

    // const scientificCommitteeQuery = 'SELECT * FROM scientific_committee';

    // connection.query(scientificCommitteeQuery, (err, results) => {
    //     if (err) {
    //         console.error('Error connecting to the database: ', err.stack);
    //         return res.status(500).send('Error connecting to the database');
    //     }

        res.render('sc');
    });
// });

module.exports = router;