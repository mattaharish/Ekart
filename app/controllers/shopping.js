var express = require( 'express' );
var router = express.Router();

var mongoose = require( 'mongoose' );

var User = require( '../models/User' );
var product = require( '../models/Product' );
var responseGenerator = require( './../../libs/responseGenerator' );
var Product = mongoose.model( 'Product' );

//Show all the products available
router.get( '/dashboard/allproducts', ensureAuthenticated, function (
  req, res ) {
  Product.find( {}, function ( err, products ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      res.render( 'dashboard-test/index', {
        products: products,
        added: req.flash( 'added' )
      } );
    }
  } );
} );

// View single product
router.get( '/product-view/:id', ensureAuthenticated, function ( req, res ) {
  var id = req.params.id;
  Product.find( {
    _id: id
  }, function ( err, products ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      res.render( 'dashboard-test/product-view', {
        products: products,
        added: req.flash( 'added' )
      } );
    }
  } );
} );

// Adding the products into cart
router.get( '/product/add-to-cart/:id/:brand/:model/:price',
  ensureAuthenticated,
  function ( req,
    res ) {
    var id = req.user.id;
    //console.log( id );
    //Product.cart.push( pid )
    User.findByIdAndUpdate(
      id, {
        $push: {
          "cart": {
            productId: req.params.id,
            brand: req.params.brand,
            model: req.params.model,
            quantity: req.query.quantity
          }
        }
      }, {
        new: true
      },
      function ( err, products ) {
        if ( err ) {
          var response = responseGenerator.generate( true, "Some Error",
            500, null );
          res.render( 'error', {
            message: response.message
          } );
        } else {
          req.flash( 'added',
            'Item added to cart, continue shopping' );
          res.redirect( '/users/dashboard/allproducts' );
          //products.cart.push( pid );
          console.log( products );
        }
      } );
  } );

// Remove product from cart
router.post( '/product/remove-from-cart', ensureAuthenticated, function ( req,
  res ) {
  var productId = req.body.productId;
  console.log( productId );
  User.update( {
    _id: req.user.id
  }, {
    $pull: {
      cart: {
        productId: req.body.productId
      }
    }
  }, {
    safe: true
  }, function ( err, result ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      req.flash( 'removed', "An item removed from cart" );
      res.redirect( '/users/cart' );
    }
  } );
} );

// Show Cart Items
router.get( '/cart', ensureAuthenticated, function ( req, res ) {
  User.findOne( {
    _id: req.user.id
  }, function ( err, products ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      console.log( products.cart );
      res.render( 'dashboard-test/cart', {
        products: products.cart,
        removed: req.flash( 'removed' )
      } );
    }
  } );
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
