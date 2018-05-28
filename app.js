//Express
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const User = require('./models/user');
const Category = require('./models/categories');
const Menu = require('./models/menu')
const Bestilling = require('./models/bestillinger');


const mongodbURL = 'mongodb://admin:admin@ds159489.mlab.com:59489/restaurant_app';

mongoose.connect(mongodbURL);



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

app.get("/panel-admin",isLoggedIn, function(req, res) {
    if(req.user.username.includes('bord') !== true){
        return res.render("panel-admin")
    }else{
        res.render("panel-user");
    }
  
});
// =====================
// CATEGORY
// =====================

//NEW ROUTE
app.get("/category/new", function(req, res) {
  res.render("newCategory");
});

app.get("/category",isLoggedIn, function(req, res) {
    if(req.user.username.includes('bord') !== true){
        Category.find({"shop.id": req.user._id }, function(err, foundCategories) {
            if (err) {
              res.redirect("/panel-admin");
            } else {
              res.render("category", { Categories: foundCategories });
            }
          });
    }else{
        Category.find({"shop.id": req.user._id }, function(err, foundCategories) {
            if (err) {
              res.redirect("/login");
            } else {
              res.render("userCategory", { Categories: foundCategories });
            }
          });
    }
  
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
  Category.create(newCategory, req.params.id, function(err, newlyCreated) {
    console.log(newCategory);
    if (err) {
      console.log("Try again")
      res.render("newCategory");
    } else {
      res.redirect("/category");
    }
  });
});


// //  VIRKER IKKE SHOW ROUTE
// app.get("/category/:id", function (req,res) {
//   Category.find(req.params.id, function (err, foundCategory) {
//       if (err) {
//           console.log(err)
//       } else {
//           console.log("success")
//           res.redirect("/menu");
//       }
//   });
// });

// VIRKER IKKE
// app.delete("/category/:id", function (req ,res) {
//   Category.findByIdAndRemove(req.params.id, function (err) {
//       if(err){
//           res.redirect("/category");
//       }else{
//           res.redirect("/category")
//       }
//   })
// });

// =====================
// MENU
// =====================

//NEW ROUTE
app.get('/category/new',isLoggedIn, function (req, res) {
    res.render('newCategory')
})

// CREATE ROUTE
app.post('/category', function (req, res) {
    Category.create(req.body.category, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/category')
        }
    })
});

app.get('/orders',isLoggedIn, function (req, res) {
    /*  var bestiling = {item: "Fiat", status:"done"}


    Bestilling.create(bestiling, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/category')
        }
    }) */ 
    
     Bestilling.find(function (err, foundCategories) {
        if (err) {
            res.redirect('/panel-admin');
        } else {

            res.render('bestillinger', { Bestillinger: foundCategories });
        }
    });  
})

app.get('/menu/:id',isLoggedIn, function (req, res) {
    console.log(req.params.id)
     if(req.user.username.includes('bord') !== true){
        Menu.find({ "_category": req.params.id }, function (err, foundMenus) {
            if (err) {
                res.redirect("/category");
            } else {
    
                res.render("menu", { Menus: foundMenus, IDs: req.params.id });
            }
        }); 
    }else{
        Menu.find({ "_category": req.params.id }, function (err, foundMenus) {
            if (err) {
                res.redirect("/category");
            } else {
    
                res.render("userMenu", { Menus: foundMenus, IDs: req.params.id });
            }
        }); 
    }
     
  
});


app.get('/menu',isLoggedIn, function (req, res) {
    /* Menu.create(req.body.menu, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/category')
        }
    }) */

     /* var menuz = {item: "jebne mix", description:"done", price:"10", _category:"5ae6de3ebf437913e53abb19"}

    Menu.create(menuz, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/category')
        }
    })  */
})

app.post('/bestil', function(req, res){
    var bestiling = {item: "Fiat", status:"done"}    

    Bestilling.create(bestiling, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/category')
        }
    })
})


app.post('/zbale', function (req, res) {
    
    Bestilling.findOneAndUpdate({_id: req.body.title}, {$set:{status:req.body.message}}, {new: true}, function(err, doc){
        if(err){
            console.log("Something wrong when updating data!");
        }
    
        console.log(doc);
    });

    console.log(req.body.title)
    console.log(req.body.message)

})

app.post('/zbale1', function (req, res) {
    var zbale = "";
    req.body.forEach(function (item) {//got an exception 
        console.log(item.item);
        zbale = zbale + item.item+ " "
        zbale = zbale + item.amount+ ", "

    });
   // console.log(req.body[0].item)
   // console.log(req.body[0].amount)
   console.log(zbale)
   
    var bord = req.user.username
    
    console.log(bord) 
    var bestiling = {item: zbale, status:"todo", table: bord}
    
    Bestilling.create(bestiling, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/category')
        }
    })

})

app.get('/newMenu/:id',isLoggedIn, function(req, res){
    res.render('newMenu', {IDs : req.params.id})
})

app.post('/menu', function(req,res){
    Menu.create(req.body.menu, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
            res.redirect('/menu/'+req.body.menu._category)
        }
    })
})


app.listen(process.env.PORT || '3000', function () {
    console.log('server started...')
})
