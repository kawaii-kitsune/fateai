const mysql = require('mysql2');

// Update the host to match your Docker container settings
const connection = mysql.createConnection({
  host: 'localhost', // or 'mysql' if you were using Docker Compose networking
  user: 'root',
  password: 'rootpassword',
  database: 'evently',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = connection;
