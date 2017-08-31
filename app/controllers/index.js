var express = require( 'express' );
var router = express.Router();

// Get Homepage
router.get( '/dashboard', ensureAuthenticated, function ( req, res ) {
	if ( req.user.seller ) {
		console.log( req.user.id );
		res.redirect( 'users/seller/home' );
		res.end();
	} else {
		res.redirect( '/users/dashboard/allproducts' );
	}
} );


function ensureAuthenticated( req, res, next ) {
	if ( req.isAuthenticated() ) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect( '/users/login' );
	}
}

module.exports = router;
