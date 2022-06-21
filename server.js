const express = require("express");
require("dotenv").config();
const auth = require("./auth");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/", auth);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
