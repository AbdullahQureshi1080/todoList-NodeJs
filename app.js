// Imports
const express = require("express");
const bodyParser = require("body-parser");
// const https = require("https");
// const request = require("request");
const alert = require("alert");
const date = require(__dirname + "/date.js");

// console.log(date());

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

// Using EJS Tempelate
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extented: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  let day = date();
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  console.log(req.body);
  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is Up");
});
