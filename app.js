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

const mongodbURL = 'mongodb://admin:admin@ds159489.mlab.com:59489/restaurant_app';

mongoose.connect(mongodbURL);

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
    successRedirect: '/panel-admin',
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

app.get('/panel-admin', function(req, res){
    res.render('panel-admin');
});

app.get('/category', function(req, res){
    Category.find(function (err, foundCategories) {
        if (err) {
            res.redirect('/panel-admin');
        } else {
            res.render('category', {Categories: foundCategories}); 
        }
    });
});

app.get('/orders', function(req, res){
    res.render('orders');
});
//NEW ROUTE
app.get('/category/new', function (req, res){
    res.render('newCategory')
})

// CREATE ROUTE
app.post('/category', function (req, res){
    Category.create(req.body.category, function (err, newCategory) {
        if (err) {
            res.render('newCategory')
        } else {
                res.redirect('/category')
        }
    })
});

app.get('/bestillinger', function(req, res){
    res.render('bestillinger');
});

app.listen(process.env.PORT ||'3000', function () {
    console.log('server started...')
})