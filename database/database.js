const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql_db',  // <-- Use MySQL service name from docker-compose
  user: 'evently_user',
  password: 'evently_password',
  database: 'evently',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = connection;