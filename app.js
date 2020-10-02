//*************Imports

// Server
const express = require("express");

// Node JS Body Passing Middleware
const bodyParser = require("body-parser");

// DB Driver
const mongoose = require("mongoose");

// Import our own date module
// const date = require(__dirname + "/date.js");

const app = express();

// let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

// Using EJS Tempelate
app.set("view engine", "ejs");

// parses the request, asscessed by req.body
app.use(bodyParser.urlencoded({ extented: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
});

const itemsScheme = {
  name: String,
};

const Item = mongoose.model("Item", itemsScheme);

const item1 = new Item({
  name: "Welcome to your todo List.",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- Hit this ro delete an item.",
});

const defaultItems = [item1, item2, item3];

// delete Route

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success in deleteing the item");
      res.redirect("/");
    }
  });
});

// Main List Route - Home
app.get("/", function (req, res) {
  // const day = date.getDate();

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successful added the items to db");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  console.log(req.body);
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
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
