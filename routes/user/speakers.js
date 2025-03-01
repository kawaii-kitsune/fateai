const express = require('express');
const router = express.Router();
// const connection = require('../../database/database');

router.get('/', (req, res) => {
          res.render('speakers');
});

router.get ('/:id', (req, res) => {
    const speakersQuery = 'SELECT * FROM speakers WHERE speaker_id = ?';
    connection.query(speakersQuery, [req.params.id], (err, speakers) => {
        if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return res.status(500).send('Error connecting to the database');
        }
    
        res.render('speakerView', { speaker: speakers[0] });
    });
});

module.exports = router;