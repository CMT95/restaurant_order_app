//Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Cors = require('cors'); //test
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user');
const Category = require('./models/categories');

//Mongodb
// const MongoClient = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectID;
//const mongodburl =  'mongodb://mooz321:zbalezbale@cluster0-shard-00-00-fpxig.mongodb.net:27017,cluster0-shard-00-01-fpxig.mongodb.net:27017,cluster0-shard-00-02-fpxig.mongodb.net:27017/ligeGyldig?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

mongoose.connect('mongodb://localhost/restaurant_order_app');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(Cors());
app.use(require('express-session')({
    secret: 'authentication demo app',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');


app.get('/', function(req, res){
    res.render('login');
});

// Show sign up form
app.get('/register', function (req,res) {
    res.render('register');
});

// handling user sign up
app.post('/register', function (req,res) {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
        if(err){
            console.log('error: ', req.body);
            return res.render('register');
        }
        passport.authenticate('local')(req,res, function(){
            res.redirect('/login');
        });
    });
});

// LOGIN ROUTES

// render login form
app.get('/login', function (req ,res) {
    res.render('login');
});
// login logic
// middleware
app.post('/login',passport.authenticate('local', {
    successRedirect: '/login/panel-admin',
    failureRedirect: '/login'
}) ,function (req,res) {
});

// LOGOUT
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.get('/login/panel-admin', function(req, res){
    res.render('panel-admin');
});

app.get('/login/panel-admin/customize-menu', function(req, res){

    Category.find(function (err, foundCategories) {
        if (err) {
            res.redirect('/panel-admin');
        } else {
            res.render('customize-menu', {Categories: foundCategories});
        }
    });
    
    // MongoClient.connect(mongodburl, function (err, db) {
        
    //     var col = db.collection('Categories');
    //     // Read All
    //     col.find().toArray(function (err, result) {
    //         //console.log(result);
    //         res.render('customize-menu', {Categories: result});
    //     });
    //     db.close();
    // });
});

app.get('/panel-admin/orders', function(req, res){
    res.render('orders');
});


app.listen(process.env.PORT ||'3000', function () {
    console.log('server started...')
})