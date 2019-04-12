var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index.route');
var auth = require('./routes/auth.route');
var users = require('./routes/users.route');
var orders = require('./routes/orders.route');
var categories = require('./routes/categories.route');
var menu = require('./routes/menu.route');

var app = express();
var cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}));

auth(app);

app.use('/', routes);
app.use('/', menu);
app.use('/categories', categories);
app.use(function (req, res, next) {
	if (req.isAuthenticated())
		next();
	else {
		var err = new Error('Unauthorized');
		err.status = 401;
		next(err);
	}
});

app.use('/users', users);
app.use('/orders', orders);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err.stack
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});


module.exports = app;