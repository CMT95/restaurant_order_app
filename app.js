//Express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Cors = require("cors"); //test
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");
const Category = require("./models/categories");

const mongodbURL =
  "mongodb://admin:admin@ds159489.mlab.com:59489/restaurant_app";

mongoose.connect(mongodbURL);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(Cors());
app.use(
  require("express-session")({
    secret: "authentication demo app",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("index");
});

// Show sign up form
app.get("/register", function(req, res) {
  res.render("register");
});

// handling user sign up
app.post("/register", function(req, res) {
  req.body.username;
  req.body.password;
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log("error: ", req.body);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/login");
      });
    }
  );
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// =====================
// LOGIN
// =====================

// render login form
app.get("/login", function(req, res) {
  res.render("login");
});

// login logic
// middleware
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/panel-admin",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// LOGOUT
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

app.get("/panel-admin", function(req, res) {
  res.render("panel-admin");
});
app.get("/orders", function(req, res) {
  res.render("orders");
});

// =====================
// CATEGORY
// =====================

//NEW ROUTE
app.get("/category/new", function(req, res) {
  res.render("newCategory");
});

app.get("/category", function(req, res) {
  Category.find({ "shop.id": req.user._id }, function(err, foundCategories) {
    if (err) {
      res.redirect("/panel-admin");
    } else {
      res.render("category", { Categories: foundCategories });
    }
  });
});

app.get("/category/:id", function (req,res) {
  Blog.findById(req.params.id, function (err, foundMenu) {
      if (err) {
          res.redirect("/category");
      } else {
          res.render("/menu", {Menu: foundMenu});
      }
  });
});

// CREATE ROUTE
app.post("/category", function(req, res) {
  var title = req.body.category.title;
  var image = req.body.category.image;
  var shop = {
    id: req.user._id,
    username: req.user.username
  };
  var newCategory = { title: title, image: image, shop: shop };
  Category.create(newCategory, function(err, newlyCreated) {
    console.log(newCategory);
    if (err) {
      console.log("Try again")
      res.render("newCategory");
    } else {
      res.redirect("/category");
    }
  });
});

app.listen(process.env.PORT || "3000", function() {
  console.log("server started...");
});
