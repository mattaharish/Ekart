var mongoose = require( 'mongoose' );
var bcrypt = require( 'bcryptjs' );

// Cart Schema
var cartSchema = new mongoose.Schema( {
	productId: String,
	//name : String,
	quantity: Number,
	brand: String,
	model: String,
	price: Number
} );

// User Schema
var UserSchema = mongoose.Schema( {

	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		//unique: true
	},
	firstname: {
		type: String
	},
	name: {
		type: String
	},
	lastname: {
		type: String
	},
	mobile: {
		type: Number
	},
	seller: {
		type: Boolean
	},
	pancard: {
		type: String
	},
	merchant: {
		type: String
	},
	security: {
		type: String
	},
	cart: [ cartSchema ]
} );

var User = module.exports = mongoose.model( 'User', UserSchema );

module.exports.createUser = function ( newUser, callback ) {
	bcrypt.genSalt( 10, function ( err, salt ) {
		bcrypt.hash( newUser.password, salt, function ( err, hash ) {
			newUser.password = hash;
			newUser.save( callback );
		} );
	} );
}

module.exports.getUserByUsername = function ( username, callback ) {
	var query = {
		email: username
	};
	User.findOne( query, callback );
}

module.exports.getUserById = function ( id, callback ) {
	User.findById( id, callback );
}

module.exports.comparePassword = function ( candidatePassword, hash, callback ) {
	bcrypt.compare( candidatePassword, hash, function ( err, isMatch ) {
		if ( err ) throw err;
		callback( null, isMatch );
	} );
}
