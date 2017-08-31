var mongoose = require( 'mongoose' );
var bcrypt = require( 'bcryptjs' );

// Mobile Schema
var mobileSchema = new mongoose.Schema( {
  brand: String,
  model: String,
  description: String,
  price: Number,
  ram: Number,
  strorage: Number,
  camera: Number,
  cpu: String,
  warranty: Number,
  stock: Number,
  color: String
} );

// Laptop Schema
var laptopSchema = new mongoose.Schema( {
  brand: String,
  model: String,
  description: String,
  price: Number,
  processor: String,
  ram: Number,
  strorage: Number,
  warranty: Number,
  stock: Number,
  color: String
} );

//Cloth Schema
var clothSchema = new mongoose.Schema( {
  idealFor: String,
  price: Number,
  brand: String,
  size: String,
  model: String,
  stock: Number,
  color: String,
  description: String
} );

//Footware Schema
var footwareSchema = new mongoose.Schema( {
  idealFor: String,
  brand: String,
  size: String,
  price: Number,
  model: String,
  stock: Number,
  color: String,
  description: String
} );

var ProductSchema = mongoose.Schema( {
  mobiles: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mobile'
  } ],
  laptops: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laptop'
  } ],
  clothes: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloth'
  } ],
  footware: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Footware'
  } ]
} );

mongoose.model( 'Mobile', mobileSchema );
mongoose.model( 'Laptop', laptopSchema );
mongoose.model( 'Cloth', clothSchema );
mongoose.model( 'Footware', footwareSchema );
mongoose.model( 'Product', ProductSchema );
