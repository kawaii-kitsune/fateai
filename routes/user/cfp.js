const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const connection = require('../../database/database');


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/uploads/submitions');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {

  const scientificCommitteeQuery = `
    SELECT * FROM scientific_committee 
    WHERE name IN (
      'Konstantina Spanaki',
      'Christos Floros',
      'Constantin Zopounidis',
      'Christos Lemonakis'
    )
  `;

  connection.query(scientificCommitteeQuery, (err, results) => {
      if (err) {
          console.error('Error connecting to the database: ', err.stack);
          return res.status(500).send('Error connecting to the database');
      }

      res.render('cfp', { sc: results });
  });
});


router.post('/upload', upload.single('file'), (req, res) => {
  const { name, university, email } = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const paperData = {
    name: name,
    university: university,
    email: email,
    filePath: req.file.path
  };

  const insertPaperQuery = `
    INSERT INTO papers (name, university, email, file_path)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(insertPaperQuery, [paperData.name, paperData.university, paperData.email, paperData.filePath], (err, results) => {
    if (err) {
      console.error('Error inserting paper data into the database: ', err.stack);
      return res.status(500).send('Error saving paper data');
    }

    res.send('Paper submitted successfully.');
  });
});

module.exports = router;