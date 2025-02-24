const express = require('express');
const router = express.Router();
// const connection = require('../../database/database');

router.get('/', (req, res) => {
  // const eventsQuery = 'SELECT * FROM events';
  // const pricingQuery = 'SELECT * FROM pricing';
  // const blogsQuery = 'SELECT * FROM blogs';
  // const committeeQuery = 'SELECT * FROM scientific_committee';

  // connection.query(eventsQuery, (err, events) => {
  //   if (err) {
  //     console.error('Error connecting to the database: ', err.stack);
  //     return res.status(500).send('Error connecting to the database');
  //   }

  //   connection.query(pricingQuery, (err, pricing) => {
  //     if (err) {
  //       console.error('Error connecting to the database: ', err.stack);
  //       return res.status(500).send('Error connecting to the database');
  //     }

  //     connection.query(blogsQuery, (err, blogs) => {
  //       if (err) {
  //         console.error('Error connecting to the database: ', err.stack);
  //         return res.status(500).send('Error connecting to the database');
  //       }

  //       connection.query(committeeQuery, (err, committee) => {
  //         if (err) {
  //           console.error('Error connecting to the database: ', err.stack);
  //           return res.status(500).send('Error connecting to the database');
  //         }

          res.render('about');
        });
//       });
//     });
//   });
// });

module.exports = router;