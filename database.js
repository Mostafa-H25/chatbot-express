const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "chatbot-db",
  connectionLimit: 10,
});

module.exports = pool;
