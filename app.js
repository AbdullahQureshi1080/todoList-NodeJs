//*************Imports

// Server
const express = require("express");

// Node JS Body Passing Middleware
const bodyParser = require("body-parser");

// Import our own date module
const date = require(__dirname + "/date.js");

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

// Using EJS Tempelate
app.set("view engine", "ejs");

// parses the request, asscessed by req.body
app.use(bodyParser.urlencoded({ extented: true }));
app.use(express.static("public"));

// Main List Route - Home
app.get("/", function (req, res) {
  const day = date.getDate();
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  console.log(req.body);
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

// Work List Route
app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

// About Route - extra test for ejs tempelating and reuse
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is Up");
});
