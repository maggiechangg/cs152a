var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");
const axios = require('axios');
const auth = require('./routes/auth');
const session = require("express-session"); 
const MongoDBStore = require('connect-mongodb-session')(session);

// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const courses = require('./public/data/courses20-21.json')

// *********************************************************** //
//  Loading models
// *********************************************************** //
const Course = require('./models/Course')

// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
//const mongodb_URI = 'mongodb://localhost:27017/cs103a_todo'
const mongodb_URI = 'mongodb+srv://cs_sj:BrandeisSpr22@cluster0.kgugl.mongodb.net/timsCS153aSum22?retryWrites=true&w=majority'

mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings
//mongoose.set('useFindAndModify', false); 
//mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bioRouter = require('./routes/bio');
// var ghibliRouter = require('./routes/ghibli');
// var runesRouter = require('./routes/runes');

var app = express();

var store = new MongoDBStore({
  uri: mongodb_URI,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.log(error);
});

app.use(require('express-session')({
  secret: 'This is a secret 7f89a789789as789f73j2krklfdslu89fdsjklfds',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts);
app.use(auth);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/bio", bioRouter);
// app.use("/ghibli", ghibliRouter);
// app.use("/runes", runesRouter);


//Runes Page Enter a Champion
const RunesHome = require('./models/Runes');

app.get('/runesHome',(req,res,next) => {
  res.render('runesHome')
})

app.post('/runesHome',
  isLoggedIn,
  async (req,res,next) => {
    try {
      const championName = req.body.championName;
      const championObj = {
        userId:res.locals.user._id,
        championName: championName,
      }
      const championItem = new RunesHome(championObj);
      await championItem.save(); 
      res.redirect('/showRunesHome');
    }catch(err){
      next(err);
    }
  }
)

app.get('/showRunesHome',
        isLoggedIn,
  async (req,res,next) => {
   try {
    const chapmionitems = await RunesHome.find({userId:res.locals.user._id});
    res.locals.championitems = chapmionitems
    res.render('showRunesHome')
    //res.json(todoitems);
   }catch(e){
    next(e);
   }
  }
)

app.get('/deleteChampionItem/:itemId',
    isLoggedIn,
    async (req,res,next) => {
      try {
        const itemId = req.params.itemId;
        await RunesHome.deleteOne({_id:itemId});
        res.redirect('/showRunesHome');
      } catch(e){
        next(e);
      }
    }
)


//Ghibli Example API
app.get('/ghibli',(req,res,next) => {
  res.render('ghibli')
})

app.post('/ghibli',
  async (req,res,next) => {
    try{
      const movie = req.body.movie;
      const url="https://ghibliapi.herokuapp.com/films/"+movie
      const response = await axios.get(url)
      console.dir(response.data)
      res.locals.movie = response.data
      res.render('showGhibli')
    }
    catch (err){
      console.error("Something went wrong")
      console.error(err)      
    }
  })

app.get('/uploadDB',
  async (req,res,next) => {
    //await Course.deleteMany({})
    await Course.deleteMany({});
    await Course.insertMany(courses);
    const num = await Course.find({}).count();
    res.send("data uploaded: "+num)
  }
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;