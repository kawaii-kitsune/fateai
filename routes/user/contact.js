const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

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

module.exports = router;