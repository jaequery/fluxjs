var _ = require('underscore');
var secrets = require('./config/secrets');
var mongoose = require('mongoose');
var express = require('express');
var async = require('async');
var path = require('path');
var bodyParser = require('body-parser');

var Site = require('./models/Site');

// flux lib
var main = require('./lib/main');

// start express
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup mongodb
mongoose.connect(secrets.mongodb);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.',secrets.mongodb);
});
mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB');
});

// pre-initialize
app.use(function(req, res, next){
  main.get_site(req.headers.host, function(site){
    res.locals.site = site;
    next();
  });
});

app.post('/auth', function(req,res){
  var pass = req.body.pass;
  var auth = (pass == secrets.password);

  console.log(pass, auth);
  res.send(auth);
});

// controllers
app.get('/api/loader/images', function(req, res){
  var site = res.locals.site;
  res.send(site);
});

app.get('/api/site', function(req, res){
  var site = res.locals.site;
  res.send(site);
});

app.post('/api/site', function(req, res){
  var site = res.locals.site;
  var post = req.body;

  site.data = post.data;
  site.save(function(err, site){
    res.send(site);
  });

});

app.get('*', function(req, res){

  if(res.locals.site){

    var site = res.locals.site;

    // get items to draw
    console.log(site);

    // if site exists
    var vars = {
      site: res.locals.site
    }

    // render page
    res.render('page', vars);

  }else{

    // if site doesn't exist, temporarily create a mock site (until registration put in place)
    var data = {
      domain: req.headers.host
    };
    var site = new Site(data);
    site.save(function(err, site){
      res.send('site initialized, hit refresh!');
    });
    //res.send('sign up');
  }

});

// start the engine, listens on port 9099 by default
app.listen(secrets.port, function(){
  console.log('listening on port', secrets.port);
});
