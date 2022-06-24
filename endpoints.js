const express = require("express");
const endpoints = express.Router();

endpoints.get("/hello", (req, res) => {
  res.send({ message: "Success", data: "Hello World" });
});

module.exports = endpoints;
