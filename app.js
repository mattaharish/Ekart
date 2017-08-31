var express = require( 'express' );
var path = require( 'path' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );
var expressValidator = require( 'express-validator' );
var flash = require( 'connect-flash' );
var session = require( 'express-session' );
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;
var mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/Ekart' );
var db = mongoose.connection;

var routes = require( './app/controllers/index' );
var users = require( './app/controllers/users' );

// Init App
var app = express();

// View Engine
app.set( 'views', path.join( __dirname, '/app/views' ) );
app.set( 'view engine', 'ejs' );
app.use( express.static( __dirname + '/public' ) );

// BodyParser Middleware
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
  extended: false
} ) );
app.use( cookieParser() );

// Set Static Folder
app.use( express.static( path.join( __dirname, 'public' ) ) );

// Express Session
app.use( session( {
  secret: 'secret',
  saveUninitialized: true,
  resave: true
} ) );

// Passport init
app.use( passport.initialize() );
app.use( passport.session() );

// Express Validator
app.use( expressValidator( {
  errorFormatter: function ( param, msg, value ) {
    var namespace = param.split( '.' ),
      root = namespace.shift(),
      formParam = root;

    while ( namespace.length ) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
} ) );

// Connect Flash
app.use( flash() );

// Global Vars
app.use( function ( req, res, next ) {
  res.locals.error = req.flash( 'error' );
  res.locals.user = req.user || null;
  next();
} );

//Routes Definition
app.use( '/', routes );
app.use( '/users', users );

// catch 404 and forward to error handler
app.get( '*', function ( req, res, next ) {
  req.status = 404;
  next( "Page Not Found!!" );
} );

// error handler
app.use( function ( err, req, res, next ) {

  if ( req.status == 404 ) {
    res.render( 'error', {
      message: err
    } );
  }
} );

// Set Port
app.set( 'port', ( process.env.PORT || 8000 ) );

app.listen( app.get( 'port' ), function () {
  console.log( 'Server started on port ' + app.get( 'port' ) );
} );
