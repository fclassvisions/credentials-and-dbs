const express = require("express");
require("dotenv").config();
const { authorize, router } = require("./auth");
const endpoints = require("./endpoints");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/", router);
app.use(authorize);
app.use("/secure", endpoints);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
