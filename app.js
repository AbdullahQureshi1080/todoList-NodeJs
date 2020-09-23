const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extented: true }));

app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Server is running");
});

app.listen(3000, () => {
  console.log("Server is Up");
});
