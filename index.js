// Creating the express server
const express = require('express');
// Importing the routes
const routes = require('./routes');
//Setting the path to use it with views
const path = require('path');
//Import connect-flash dependency
const flash = require('connect-flash');
//Import express-session dependency
const session = require('express-session');
//Import cookie-parser dependency
const cookieParser = require('cookie-parser');
// Import passport config
const passport = require('./config/passport');
// Getting environment values
require('dotenv').config({ path: 'variables.env'});

// Import the helpers
const helpers = require('./helpers');

// Database connection
const db = require('./config/db');

// Getting DB models
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

// Setting the DB conection
db.sync()
    .then(() => console.log('Conectado al Servidor exitosamente'))
    .catch(error => console.log(error));

// Creating the express app 
const app = express();

// Using body parser to allow read form fields
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Pointing to static folder
app.use(express.static('public'));

// Setting pug
app.set('view engine', 'pug');

// Add the views folder
app.set('views', path.join(__dirname, './views'));

//Set flash messages
app.use(flash());

app.use(cookieParser());

// Session allow navigate between pages with no re-auth 
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// Init passport and use session
app.use(passport.initialize());
app.use(passport.session());

// Passing to app: vardump function, flash() messages
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.messages = req.flash(); 
    res.locals.user = {...req.user} || null;
    next();
} );

//Setting the app routes
//Home route
app.use('/', routes());

// Setting Server and Port
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

app.listen(port, host, () => {
    console.log('The server is running...');
});