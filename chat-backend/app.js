var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var ConRouter = require('./routes/conRouter');
var Pusher = require("pusher");
var app = express();

var pusher = new Pusher({
  appId: "1132968",
  key: "9c54870369afcd522730",
  secret: "9b807590fa9d11cdd4c5",
  cluster: "ap2",
  useTLS: true
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect("mongodb://localhost:27017/chatapp")
.then((db)=>{
  console.log("Connected to the Server");
})
.catch(err=>{
  console.log(err);
});
const db = mongoose.connection;
 db.once("open",()=>{
  console.log("DB connected");

  const msgCollection = db.collection("conversations");
  const changeStream = msgCollection.watch();

  changeStream.on("change",(change)=>{
    console.log("A chnge occured", change);

    if(change.operationType === 'insert') {
      const messageDetails = change.fullDocument;
      pusher.trigger("conversation","inserted",
      {
        message : messageDetails.message,
        sender : messageDetails.sender,
        receiver : messageDetails.receiver,
      }
      );
    }
    else {
      console.log("Error Trigging Pusher");
    }
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/conversations',ConRouter);

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

// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
