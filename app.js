const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
PORT = 5000
require('dotenv').config();
const MongoStore = require('connect-mongo');
const connectDB = require('./server/db');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
/* Session */
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions"
  }),
  cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

connectDB();


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('layout', 'main');

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/blog'));

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
  });