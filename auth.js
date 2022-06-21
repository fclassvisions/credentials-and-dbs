const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

const pool = mysql.createPool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  connectionLimit: process.env.CONNECTION_LIMIT,
});

router.post("/register", (req, res) => {});

router.post("/login", (req, res) => {});

module.exports = router;
