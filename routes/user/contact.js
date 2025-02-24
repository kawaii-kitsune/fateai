const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
// const connection = require('../../database/database');

router.get('/', (req, res) => {
  res.render('contact');
});

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // replace with your email
      pass: 'your-email-password' // replace with your email password
    }
  });

  // Set up email data
  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com', // replace with your email
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
      return res.status(500).send('Error sending email');
    }
    res.send('Email sent successfully');
  });
});
// Handle new message creation
// router.post('/messages', (req, res) => {
//   const { fullname, emailaddress, subject, comments } = req.body;
//   const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

//   const query = 'INSERT INTO contact_messages (fullname, emailaddress, subject, message, created_at) VALUES (?, ?, ?, ?, ?)';
//   connection.query(query, [fullname, emailaddress, subject, comments, created_at], (err, result) => {
//     if (err) {
//       console.error('Error creating message:', err);
//       return res.status(500).send('Error creating message');
//     }
//     res.redirect('/');
//   });
// });
module.exports = router;