//var dash = require('appmetrics-dash');
//dash.attach();
var express = require('express');
var Sequelize = require("sequelize");
var cookieParser = require('cookie-parser');
var configFile = require('../config_vars.json');
var userService = require('./mysql/services/userService');
var mongoose = require('mongoose');
//var appmetrics = require('appmetrics');
//var monitoring = appmetrics.monitor();
var app = express();
app.use(cookieParser())
app.use(require('./routes/create-account-route'));
app.use(require('./routes/login-route'));
app.use(express.static('app/public'));
app.set('port', process.env.PORT || 3000);
app.set('appConfig', configFile);

//mysql database
var sequelize = new Sequelize({
    host: configFile.mysql_host,
    port: configFile.mysql_port,
    database: configFile.mysql_database,
    dialect: configFile.mysql_dialect,
    username: configFile.mysql_username,
    password: configFile.mysql_password
});
//connect to mysql database and create table users if one does not exist
sequelize.authenticate().then(()=>{
    console.log("connected to mysql");
    var user = userService(sequelize);
    app.set('userService', user);
}).catch((err) =>{
    console.log(err);
    process.exit(1);
});

// Connect to MongoDB
mongoose.connect('mongodb://'+ configFile.mongodb_host +':'+ configFile.mongodb_port + '/' + configFile.mongodb_db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected')
});

var server = app.listen(app.get('port'), function() {
    console.log("listening on port " + app.get('port'));
});

// dash.monitor({
//     server: server
// });
