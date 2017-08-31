var express = require( 'express' );
var router = express.Router();
var mongoose = require( 'mongoose' );

var User = require( '../models/User' );
var product = require( '../models/Product' );
var responseGenerator = require( './../../libs/responseGenerator' );
var Product = mongoose.model( 'Product' );


//Add electronic product to database by seller
router.post( '/addproduct/electronic', function ( req, res ) {
  if ( typeof req.user.seller == "undefined" ) {
    res.redirect( '/users/login' );
  }
  var newProduct = {
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    ram: req.body.ram,
    storage: req.body.storage,
    camera: req.body.camera,
    cpu: req.body.cpu,
    stock: req.body.stock,
    warranty: req.body.warranty,
    color: req.body.color,
    size: req.body.size,
    seller: req.user.id
  };
  //console.log( product );

  var product = new Product( newProduct );
  product.save( function ( err ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      req.flash( 'added_product', 'Product added successfully' );
      res.redirect( '/users/seller/home' );
    }
  } );
} );


// Add fashion product to db by seller
router.post( '/addproduct/fashion', function ( req, res ) {

  var newProduct = {
    brand: req.body.brand,
    idealFor: req.body.idealFor,
    description: req.body.description,
    price: req.body.price,
    size: req.body.size,
    model: req.body.model,
    color: req.body.color,
    stock: req.body.stock,
    warranty: req.body.warranty,
    seller: req.user.id
  };
  var product = new Product( newProduct );
  product.save( function ( err ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      req.flash( 'added_product', 'Product added successfully' );
      res.redirect( '/users/seller/home' );
    }
  } );
} );

// Homepage for seller
router.get( '/home', function ( req, res ) {
  //console.log( "Matta" );
  res.render( 'home', {
    added_product: req.flash( 'added_product' ),
    updated: req.flash( 'edited' ),
    deleted: req.flash( 'deleted' )
  } );

} );

// Products added by seller
router.get( '/products', function ( req, res ) {
  Product.find( {
    seller: req.user.id
  }, function ( err, products ) {
    if ( err ) {
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      res.render( 'seller-products', {
        products: products
      } );
    }
  } );

} );

// View the details of particular product
router.get( '/products/:id', function ( req, res ) {
  var id = req.params.id;
  //console.log( id );
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
      if ( products[ 0 ].idealFor ) {
        res.render( 'seller-single-view-fashion', {
          products: products
        } );
      } else {
        res.render( 'seller-single-view-electronic', {
          products: products
        } );
      }
    }
  } );
} );

//Edit the existing fashion product
router.get( '/fashion/edit/:id', function ( req, res ) {
  //console.log( req.user.seller );
  var id = req.params.id;
  console.log( id );
  Product.find( {
    _id: id
  }, function ( err, products ) {
    console.log( products );
    if ( err ) {
      console.log( "Error dish" );
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      console.log( "Matta" );
      //console.log( products );
      res.render( 'seller-edit-fashion', {
        products: products
      } );
    }
  } );
} );

//Edit the existing electronic product
router.get( '/electronic/edit/:id', function ( req, res ) {
  //console.log( req.user.seller );
  var id = req.params.id;
  console.log( id );
  Product.find( {
    _id: id
  }, function ( err, products ) {
    console.log( products );
    if ( err ) {
      console.log( "Error dish" );
      var response = responseGenerator.generate( true, "Some Error",
        500, null );
      res.render( 'error', {
        message: response.message
      } );
    } else {
      console.log( "Matta" );
      //console.log( products );
      res.render( 'seller-edit-electronic', {
        products: products
      } );
    }
  } );
} );

//POST Edit the existing electronic product
router.post( '/products/edit/electronic/:id', function ( req, res ) {
  var id = req.params.id;
  console.log( id );
  var editedProduct = {
    brand: req.body.brand,
    model: req.body.model,
    description: req.body.description,
    price: req.body.price,
    ram: req.body.ram,
    storage: req.body.storage,
    camera: req.body.camera,
    cpu: req.body.cpu,
    stock: req.body.stock,
    warranty: req.body.warranty,
    color: req.body.color,
  };
  Product.findOneAndUpdate( {
    _id: id
  }, editedProduct, function ( err ) {
    if ( err ) {
      res.render( 'error', {
        message: "Some Error"
      } );
    } else {
      req.flash( 'edited', 'Product updated successfully' );
      res.redirect( '/users/seller/home' );
    }
  } );
} );

//POST Edit the existing fashion product
router.post( '/products/edit/fashion/:id', function ( req, res ) {
  var id = req.params.id;
  console.log( id );
  var editedProduct = {
    brand: req.body.brand,
    idealFor: req.body.idealFor,
    description: req.body.description,
    price: req.body.price,
    size: req.body.size,
    model: req.body.model,
    color: req.body.color,
    stock: req.body.stock,
    warranty: req.body.warranty
  };
  console.log( editedProduct );
  Product.findOneAndUpdate( {
    _id: id
  }, editedProduct, function ( err ) {
    if ( err ) {
      res.render( 'error', {
        message: "Some Error"
      } );
    } else {
      req.flash( 'edited', 'Product updated successfully' );
      res.redirect( '/users/seller/home' );
    }
  } );

} );

//POST delete product from seller's account
router.post( '/products/delete/:id', function ( req, res ) {
  var id = req.params.id;
  Product.findOneAndRemove( {
    _id: id
  }, function ( err ) {
    if ( err ) {
      res.render( 'error', {
        message: "Some Error"
      } );
    } else {
      req.flash( 'deleted', 'Product deleted successfully' );
      res.redirect( '/users/seller/home' );
    }
  } );

} );

module.exports = router;
