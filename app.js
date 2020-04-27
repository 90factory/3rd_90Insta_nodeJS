const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const postRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const models = require('./models/index');

const app = express();

models.sequelize.sync().then( () => {
  console.log('DB 연결 성공');
}).catch(err => {
  console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//내부디버거
app.use(express.static('public'));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(cors());

app.use('/comments', commentRouter);
app.use('/posts', postRouter);

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

// [JB] CORS 문제로 인해 추가
// const corsOpt = function(req, callbank){
//   callbank(null, {origin: true});
// }; //모든 도메인의 통신을 허용

// app.options('*', cors(corsOpt));

app.listen(80, function(){
  console.log('CORS-enabled web server listening on port 80');
});


module.exports = app;
