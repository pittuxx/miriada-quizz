var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));//modificado
app.use(cookieParser('semillita'));
//setea la caducidad de la cookie en la propiedad maxAge
//app.use(session({secret: 'semillita', cookie: { maxAge: 10000 }}));
app.use(session({secret: 'semillita'}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//helper dinámico
app.use(function(req,res,next){
    //guardar path en session.redir para después de login
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }

    //hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

//Autologout sin cookies
app.use(function(req,res,next){
    var now = Date.now();
    var maxTime = new Date(now - (120 * 1000));

    if (req.session.user && !req.path.match(/\/logout/)){
        if(!req.session.la || req.session.la > maxTime){
            req.session.la = now;
            console.log('no caduca');
        }else{
            delete req.session.user;
            delete req.session.la;
            console.log('caduca la sesión')
            return res.render('index.ejs', 
                { title: 'Quiz', errors: [{message: 'Sesión caducada'}]},
                function(err,html){
                res.send(html + '<script>alert(\"Su sesión ha caducado\")</script>');
            });
        }
    }else{
        console.log('no hay usuario');
    }
    next();
});

//AutoLogout basado en cookies, caduca la cookie, caduca la sesión
//app.use(function(req,res,next){
//
//    if(req.session.user){
//        console.log('no caducado');  
//    }else{
//        console.log('nadie logueado');
//    }
//    next();
//});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
