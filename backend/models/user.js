const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

const Place = require('./place')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, //unique creates an index for the email, which speeds up the query when the email is requestec
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  // places is an array a user can have more than one place
  // set type to accept an id
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: Place }], // ref establishes connection with schema (schema with schema, cant ref model)
});

// plugin only creates user if the user doesn't exist already
userSchema.plugin(uniquevalidator);

// Notes are in place.js models
module.exports = mongoose.model('Users', userSchema);