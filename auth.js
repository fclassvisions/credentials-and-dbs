const express = require("express");
const argon2 = require("argon2");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const router = express.Router();

const jwtKey = "secret";
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

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res
      .status(400)
      .send({ message: "Must provide a username and password", data: null });
    return;
  }

  pool.query(
    "SELECT * FROM user_auth WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to login", data: null });
        return;
      }

      if (result.length !== 1) {
        res.status(500).send({ message: "Failed to login", data: null });
        return;
      }

      if (!result[0].active) {
        res.status(500).send({ message: "Account is not active", data: null });
        return;
      }

      const hashedPassword = result[0].password;
      const isPassword = await argon2.verify(hashedPassword, password);

      if (!isPassword) {
        res.status(500).send({ message: "Bad Credentials", data: null });
        return;
      }

      pool.query(
        "SELECT * FROM user WHERE username = ?",
        [username],
        (err, result2) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: "Failed to login", data: null });
            return;
          }

          if (result.length !== 1) {
            res.status(500).send({ message: "Failed to login", data: null });
            return;
          }

          const token = jwt.sign({ user: result2[0] }, jwtKey, {
            expiresIn: "1h",
          });

          res.send({ message: "Login Successful", data: token });
        }
      );
    }
  );
});

const authorize = (req, res, next) => {
  const auth = req.headers.authorization;
  // auth header = "Bearer ejy...................."
  if (!auth) {
    res.status(401).send({ message: "Missing Token", data: null });
    return;
  }

  const token = auth.substr(7, auth.length);

  try {
    jwt.verify(token, jwtKey);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Invalid Token", data: null });
  }
};

module.exports = { authorize, router };
