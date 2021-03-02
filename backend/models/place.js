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
  // set type to accept an id
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // ref establishes connection with schema (schema with schema, cant ref model)
})

// using a schema, models define the structure of a document. A model is a class with which we construct documents
// first argument is name of schema, will also serve as name of the collection
module.exports = mongoose.model('Places', placeSchema);