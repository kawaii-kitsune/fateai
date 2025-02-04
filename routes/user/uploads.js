const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const uploadsDir = path.join(__dirname, '../../assets/uploads');
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).send('Error reading uploads directory');
    }
    res.render('uploads', { files });
  });
});

module.exports = router;