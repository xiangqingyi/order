const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);  // redis存储
const logger = require('morgan');
const config = require('./config/config');
const compression = require('compression');
const helmet = require('helmet');
const core = require('./libs/core');
// const apiRoute = require('./routes/api');
const appRoute = require('./routes/app');
const serverRoute = require('./routes/server');


const app = express();

app.locals = {
  title: config.title,
  staticdir: config.homepage   // /order
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(config.homepage,express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.session.secret,
  name: 'order',
  resave: true,
  saveUninitialized: true
}));
app.use(compression());
app.use(helmet.noCache());  //nocache 不设置缓存

// app.use(config.homepage, apiRoute);
app.use('/orderapp', appRoute);
app.use(config.homepage, serverRoute);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
  // res.status(err.status || 500);
  // res.render('error');
// });
let server = app.listen(config.port || 1001,function () {
  core.logger.info('网站服务启动' + server.address().port);
  core.logger.info('mysql database:' + config.db.database);
})
module.exports = app;
