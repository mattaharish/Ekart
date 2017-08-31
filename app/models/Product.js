var mongoose = require( 'mongoose' );

// Product Schema
var ProductSchema = new mongoose.Schema( {
  category: String,
  brand: String,
  model: String,
  description: String,
  price: Number,
  ram: String,
  storage: String,
  camera: String,
  cpu: String,
  warranty: String,
  stock: Number,
  color: String,
  idealFor: String,
  size: String,
  seller: String
} );

mongoose.model( 'Product', ProductSchema );
