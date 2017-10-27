var express = require( 'express' );
var router = express.Router();
var passport = require( 'passport' );
var mongoose = require( 'mongoose' );
var LocalStrategy = require( 'passport-local' ).Strategy;
var bcrypt = require( 'bcryptjs' );

var User = require( '../models/User' );
var product = require( '../models/Product' );

var Product = mongoose.model( 'Product' );

//Seller Controller
router.use( '/seller', require( './seller.js' ) );
router.use( '/', require( './shopping.js' ) );

// User Register
router.get( '/register', function ( req, res ) {
	res.render( 'signup', {
		errors: false,
		userExists: false,
		retailerExists: false
	} );
} );

// Retailer Register
router.get( '/register-retailer', function ( req, res ) {
	res.render( 'seller-signup', {
		errors: false,
		userExists: false,
		retailerExists: false
	} );
} );

//login for User and retailer
router.get( '/login', function ( req, res ) {
	//var sm = false;
	res.render( 'signin', {
		authMessage: req.flash( 'authMessage' ),
		loggedOut: req.flash( 'loggedOut' ),
		signupSuccess: req.flash( 'signupSuccess' ),
		updatedpassword: req.flash( 'updatedpassword' )
	} );
} );

//Get Forget Password Template
router.get( '/forgotpassword', function ( req, res ) {
	res.render( 'forgotpassword', {
		invalid: false
	} );
} );

//Get Change Password Template
router.get( '/changepassword', function ( req, res ) {
	res.render( 'changepassword' );;
} );

//validate security answer
router.post( '/forgotpassword', function ( req, res ) {
	var username = req.body.username;
	var security = req.body.security;
	User.find( {
		email: username
	}, function ( err, result ) {
		console.log( result );
		if ( result[ 0 ].security == security ) {
			res.redirect( '/users/changepassword' );
		} else {
			req.flash( 'invalid', 'Invalid Answer' );
			res.render( 'forgotpassword', {
				invalid: req.flash( 'invalid' )
			} );
		}
	} );
} );

//Update Password
router.post( '/changepassword', function ( req, res ) {
	var username = req.body.username;
	var password = req.body.passwd;
	bcrypt.genSalt( 10, function ( err, salt ) {
		bcrypt.hash( password, salt, function ( err, hash ) {
			password = hash;
			console.log( password );
			User.findOneAndUpdate( {
				email: username
			}, {
				"$set": {
					password: password
				}
			}, function ( err ) {
				if ( err )
					console.log( err );
				else {
					req.flash( 'updatedpassword',
						'Password Changed! Now You can Login' );
					res.redirect( '/users/login' );
				}
			} );
		} );
	} );
} );

// Register User
router.post( '/register', function ( req, res ) {
	var firstname = req.body.firstname;
	var email = req.body.email;
	var mobile = req.body.mobile;
	var lastname = req.body.lastname;
	var password = req.body.passwd;
	var security = req.body.security;
	var password2 = req.body.passwd2;

	// Validation
	req.checkBody( 'passwd2', 'Passwords do not match' ).equals( req.body.passwd );

	var errors = req.validationErrors();
	console.log( errors );

	if ( errors ) {
		res.render( 'signup', {
			errors: errors,
			userExists: false,
			retailerExists: false
		} );
	} else {
		var newUser = new User( {
			firstname: firstname,
			email: email,
			lastname: lastname,
			mobile: mobile,
			security: security,
			password: password
		} );

		User.createUser( newUser, function ( err, user ) {
			if ( err ) {
				req.flash( 'userExists', 'User already exists' );
				res.render( 'signup', {
					errors: false,
					userExists: req.flash( 'userExists' ),
					retailerExists: false
				} );
			} else {
				req.flash( 'signupSuccess', 'You are registered and can now login' );
				res.redirect( '/users/login' );
				console.log( user );
			}
		} );
	}
} );

//Register Retailer
router.post( '/register-retailer', function ( req, res ) {
	var name = req.body.retailer;
	var email = req.body.email;
	var mobile = req.body.mobile;
	var pancard = req.body.pancard;
	var merchant = req.body.merchant;
	var password = req.body.passwd;
	var password2 = req.body.passwd2;
	var security = req.body.security;
	var seller = true;

	// Validation
	req.checkBody( 'retailer', 'Retailer is required' ).notEmpty();
	req.checkBody( 'email', 'Email is required' ).notEmpty();
	req.checkBody( 'mobile', 'mobile is required' ).notEmpty();
	req.checkBody( 'pancard', 'pancard is required' ).notEmpty();
	req.checkBody( 'merchant', 'Merchant ID is required' ).notEmpty();
	req.checkBody( 'passwd', 'Password is required' ).notEmpty();
	req.checkBody( 'passwd2', 'Passwords do not match' ).equals( req.body.passwd );

	var errors = req.validationErrors();
	console.log( errors );

	if ( errors ) {
		res.render( 'seller-signup', {
			errors: errors,
			userExists: false,
			retailerExists: false
		} );
	} else {
		var newUser = new User( {
			name: name,
			email: email,
			mobile: mobile,
			pancard: pancard,
			merchant: merchant,
			password: password,
			seller: seller,
			security: security
		} );

		User.createUser( newUser, function ( err, user ) {
			if ( err ) {
				req.flash( 'retailerExists', 'Retailer already exists' );
				res.render( 'seller-signup', {
					errors: false,
					retailerExists: req.flash( 'retailerExists' ),
					userExists: false
				} );
			} else {
				req.flash( 'signupSuccess', 'You are registered and can now login' );
				res.redirect( '/users/login' );
				//console.log( user );
			}
		} );

	}
} );

//Passport Local Strategy
passport.use( new LocalStrategy( {
		passReqToCallback: true
	},
	function ( req, username, password, done ) {
		User.getUserByUsername( username, function ( err, user ) {
			if ( err ) throw err;
			if ( !user ) {
				return done( null, false, req.flash( 'authMessage',
					'Unknown User' ) );
			}
			User.comparePassword( password, user.password, function ( err, isMatch ) {
				if ( err ) throw err;
				if ( isMatch ) {
					return done( null, user );
				} else {
					return done( null, false, req.flash( 'authMessage',
						'Invalid password' ) );
				}
			} );
		} );
	} ) );

passport.serializeUser( function ( user, done ) {
	//console.log( req.user.mobile );
	done( null, user.id );
} );

passport.deserializeUser( function ( id, done ) {
	User.getUserById( id, function ( err, user ) {
		done( err, user );
	} );
} );

//Login Authentication
router.post( '/login',
	passport.authenticate( 'local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	} ) );

//logout Module
router.get( '/logout', function ( req, res ) {
	req.logout();
	req.flash( 'loggedOut', 'You are logged out' );
	res.redirect( '/users/login' );
} );

module.exports = router;
