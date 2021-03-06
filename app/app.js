const express = require("express");
const cookieParser = require("cookie-parser");

const productActivities = require("./productActivities.js");
const garbageActivities = require("./garbageActivities.js");
const transportActivities = require("./transportActivities.js");
const listActivities = require("./listActivities.js");
const generalStats = require("./generalStats.js");
const products = require("./products.js");
const materials = require("./materials.js");
const vehicles = require("./vehicles.js");
const users = require("./users.js");
const login = require("./login.js");
const friends = require("./friends.js");
const tips = require("./tips.js");
const register = require("./register.js");

const tokenChecker = require('./tokenChecker.js');

const app = express();

/**
 * Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Protect the UI private area
 */
app.use('/private_area', tokenChecker);

/**
 * Serve static files
 */
app.use('/', express.static('static/authentication'));
app.use('/img', express.static('static/img'));
app.use('/private_area', express.static('static/private_area'));

/**
 * protect some endpoints (also products to avoid product insertion from unauthorizes users)
 */
app.use('/api/v2/activities', tokenChecker);
app.use('/api/v2/activities/product', tokenChecker);
app.use('/api/v2/activities/garbage', tokenChecker);
app.use('/api/v2/activities/transport', tokenChecker);
app.use('/api/v2/products', tokenChecker);
app.use('/api/v2/friends', tokenChecker);
app.use('/api/v2/users', tokenChecker);



/**
 * Api endpoints routes
 */
app.use('/api/v2/activities/product', productActivities);
app.use('/api/v2/activities/garbage', garbageActivities);
app.use('/api/v2/activities/transport', transportActivities);
app.use('/api/v2/activities', listActivities);
app.use('/api/v2/generalstats', generalStats);

app.use('/api/v2/products', products);
app.use('/api/v2/materials', materials);
app.use('/api/v2/vehicles', vehicles); 

app.use('/api/v2/users', users);
app.use('/api/v2/login', login);

app.use('/api/v2/friends', friends);
app.use('/api/v2/tips', tips);
app.use('/api/v2/register', register);



module.exports = app;