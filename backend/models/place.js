const mongoose = require('mongoose')

// mongoose 3rd party library and builds on the mongodb driver
// uses schema to define the structure of the documents to be stored in the database
const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { 
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
   },
  address: { type: String, required: true },
  creator: { type: String, required: true },
})

// using a schema, models define the structure of a document
// first argument is name of schema, will also serve as name of the collection
module.exports = mongoose.model('Places', placeSchema);