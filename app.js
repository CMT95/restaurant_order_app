//Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Cors = require('cors'); //test

//Mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const mongodburl =  'mongodb://mooz321:zbalezbale@cluster0-shard-00-00-fpxig.mongodb.net:27017,cluster0-shard-00-01-fpxig.mongodb.net:27017,cluster0-shard-00-02-fpxig.mongodb.net:27017/ligeGyldig?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(Cors());
app.set('view engine', 'ejs');


app.get('/', function(req, res){
    res.render('');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/login/panel-admin', function(req, res){
    res.render('panel-admin');
});

app.get('/login/panel-admin/customize-menu', function(req, res){
    
    MongoClient.connect(mongodburl, function (err, db) {
        
        var col = db.collection('Categories');
        // Read All
        col.find().toArray(function (err, result) {
            //console.log(result);
            res.render('customize-menu', {Categories: result});
        });
        db.close();
    });
});

app.get('/login/panel-admin/orders', function(req, res){
    res.render('orders');
});


app.listen(process.env.PORT || 3000);