const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path:'./routes/.env' });

const app = express();

// Passport Config
require('./config/passport')(passport);


//DB config
const db = process.env.MONGODB_URI;
//const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


  //connect flash
  app.use(flash());


  //global vars
  app.use((req, res, next ) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  })

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server sarted on port ${PORT}`));
