const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

//var Cors = require('cors'); //test
//app.use(Cors());

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const mongodburl = 'mongodb://mooz321:zbalezbale@cluster0-shard-00-00-fpxig.mongodb.net:27017,cluster0-shard-00-01-fpxig.mongodb.net:27017,cluster0-shard-00-02-fpxig.mongodb.net:27017/ligeGyldig?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

app.get('/', function(req, res){
    res.render('login.ejs');
});

app.listen(process.env.PORT || 3000);