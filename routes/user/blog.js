const express = require('express');
const router = express.Router();
const connection = require('../../database/database');


router.get('/:id', (req, res) => {
  const blogId = req.params.id;
  const blogQuery = 'SELECT * FROM blogs WHERE blog_id = ?';

  connection.query(blogQuery, [blogId], (err, results) => {
    if (err) {
      console.error('Error connecting to the database: ', err.stack);
      return res.status(500).send('Error connecting to the database');
    }

    if (results.length === 0) {
      return res.status(404).send('Blog not found');
    }

    res.render('blog', { post: results[0] });
  });
});

module.exports = router;