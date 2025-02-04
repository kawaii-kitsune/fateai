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

module.exports = router;