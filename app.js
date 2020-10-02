// ***************************  IMPORTS  ************************

// Server
const express = require("express");

// Node JS Body Passing Middleware
const bodyParser = require("body-parser");

// DB Driver
const mongoose = require("mongoose");

// lodash
const _= require("lodash");

// Import our own date module
// const date = require(__dirname + "/date.js");

const app = express();

// Using EJS Tempelate
app.set("view engine", "ejs");

// parses the request, asscessed by req.body
app.use(bodyParser.urlencoded({ extented: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
});


// ***************************  DB CONFIG - MONGOOSE ************************

const itemsScheme = {
  name: String,
};

const listScheme = {
  name: String,
  items: [itemsScheme],
};
const Item = mongoose.model("Item", itemsScheme);
const List = mongoose.model("List", listScheme);

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


// *************************** ROUTES ************************

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
  // console.log(req.body);
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// Dynamic List Route
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show a existing List
        console.log("Exists");
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// delete Route
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted an item");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

// About Route - extra test for ejs tempelating and reuse
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is Up");
});
