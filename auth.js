const express = require("express");
const argon2 = require("argon2");
const mysql = require("mysql2");
const router = express.Router();

const pool = mysql.createPool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  connectionLimit: process.env.CONNECTION_LIMIT,
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!username || !password) {
    res
      .status(400)
      .send({ message: "Must have a username and password", data: null });
    return;
  }

  pool.query(
    "INSERT INTO user (username, first_name, last_name) VALUES (?,?,?)",
    [username, firstName, lastName],
    async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to register", data: null });
        return;
      }

      const id = result.insertId;
      const hashedPassword = await argon2.hash(password);
      pool.query(
        "INSERT INTO user_auth (username, password) VALUES (?,?)",
        [username, hashedPassword],
        (err, result2) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: "Failed to register", data: null });
            return;
          }

          res.status(201).send({
            message: "Registration Successful",
            data: { id, username, firstName, lastName },
          });
        }
      );
    }
  );
});

router.post("/login", (req, res) => {});

module.exports = router;
