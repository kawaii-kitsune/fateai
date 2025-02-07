const express = require('express');
const router = express.Router();
const connection = require('../../database/database');

router.get('/', (req, res) => {
  const eventsQuery = 'SELECT * FROM events';
  const pricingQuery = 'SELECT * FROM pricing';
  const blogsQuery = `
    SELECT blogs.*, users.username AS author
    FROM blogs
    JOIN users ON blogs.author_id = users.user_id
  `;
  const speakersQuery = 'SELECT * FROM speakers';

  connection.query(eventsQuery, (err, events) => {
    if (err) {
      console.error('Error connecting to the database: ', err.stack);
      return res.status(500).send('Error connecting to the database');
    }

    connection.query(speakersQuery, (err, speakers) => {
      if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return res.status(500).send('Error connecting to the database');
      }

      connection.query(pricingQuery, (err, pricing) => {
        if (err) {
          console.error('Error connecting to the database: ', err.stack);
          return res.status(500).send('Error connecting to the database');
        }

        connection.query(blogsQuery, (err, blogs) => {
          if (err) {
            console.error('Error connecting to the database: ', err.stack);
            return res.status(500).send('Error connecting to the database');
          }

          res.render('index', { events, pricing, blogs, speakers });
        });
      });
    });
  });
});

router.get('/index', (req, res) => {
  const eventsQuery = 'SELECT * FROM events';
  const pricingQuery = 'SELECT * FROM pricing';
  const blogsQuery = `
    SELECT blogs.*, users.username AS author
    FROM blogs
    JOIN users ON blogs.author_id = users.user_id
  `;
  const speakersQuery = 'SELECT * FROM speakers';

  connection.query(eventsQuery, (err, events) => {
    if (err) {
      console.error('Error connecting to the database: ', err.stack);
      return res.status(500).send('Error connecting to the database');
    }

    connection.query(speakersQuery, (err, speakers) => {
      if (err) {
        console.error('Error connecting to the database: ', err.stack);
        return res.status(500).send('Error connecting to the database');
      }

      connection.query(pricingQuery, (err, pricing) => {
        if (err) {
          console.error('Error connecting to the database: ', err.stack);
          return res.status(500).send('Error connecting to the database');
        }

        connection.query(blogsQuery, (err, blogs) => {
          if (err) {
            console.error('Error connecting to the database: ', err.stack);
            return res.status(500).send('Error connecting to the database');
          }

          res.render('index', { events, pricing, blogs, speakers });
        });
      });
    });
  });
});

router.get('/video', (req, res) => {
  res.render('video');
});
// Handle new message creation
router.post('/messages', (req, res) => {
  const { fullname, emailaddress, subject, comments } = req.body;
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const query = 'INSERT INTO messages (fullname, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [fullname, emailaddress, subject, comments, created_at], (err, result) => {
    if (err) {
      console.error('Error creating message:', err);
      return res.status(500).send('Error creating message');
    }
    res.redirect('/');
  });
});
module.exports = router;