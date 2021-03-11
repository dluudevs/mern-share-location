// Controllers - hold logic (middleware function) that should execute when a certain route is met
// Brings together the request with the model and logic that should run with request

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const geocode = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  // params property holds object with dynamic routes as key value pairs eg., { placeId: 'p1' }
  const placeId = req.params.placeId;

  // findById is a static method, not used on instance of place (like createPlace function). Instead it is used on the constructor function
  // remember constructor functions are functions that create an instance of a class, therefore static methods are methods defined within that class
  // findById does not return a promise, but you can still use async / await because of how mongoose works. To return a promise, chain the exec() method
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    // catches any errors with the request (eg., missing placeId)
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }

  // res.json is the same as res.send it will no longer pass the request to any subsequent middleware
  // if statement runs when no place is found
  if (!place) {
    // throwing an error will only work with synchronous actions - throw will also exit the function
    // use next to pass the error to the succeeding middleware
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    )
    return next(error);
  }

  // toObject is a mongoose method that converts the mongoose document to a javascript object
  res.json({ place: place.toObject({ getters: true }) }); // getter and setters allow you to execute custom logic when getting or setting a property on a Mongoose document
  // getters: true works here because by default mongoose assigns an id virutual getter which returns an "id" property with a value from the documents _id field - https://mongoosejs.com/docs/guide.html#id
  // virtual getters are getters return values that arent stored in MongoDB, but the values can be used locally
  // in this case we're sending the "id" property but we won't be able to query for "id" in MongoDB
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId }); // by default Mongoose returns an array, but MongoDB would return a cursor. A cursor points to the results and allows for iteration but it is not an array
  } catch (e) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  // empty array is returned from filter is nothing is found
  if (!places.length) {
    // passes error to error handling middleware defined in app.js
    return next(
      new Error("Could not find a place for the provided user id", 404)
    );
  }

  // convert results to workable javascript method
  places = places.map((place) => place.toObject({ getters: true }));
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  // check for any validation errors in req object - this only works because this function is called in a route that is using express validator .post('/')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // throw will not work properly with async tasks, must use next instead
    // next does not exit the function, throw exits function, return keyword is required with next to exit the function
    return next(new HttpError("Invalid Inputs, please check your data.", 422));
  }

  // requires bodyparser middleware (setup in app.js)
  const { title, description, address, creator } = req.body;

  let coordinates;
  // geocode is an async function (always return promise) that returns a resolved promise or an error
  // try catch block used to catch the error pass to the next middleware (this is the same concept as error handling with an if statement)
  // in an if statement, a conditional is used to determine if there is an error. in try catch, we simply check if there is an error and pass it to the next middleware
  // next must be used in an async function, it works similar to throwing an error
  // when there is an error, use return to exit the function
  try {
    coordinates = await geocode(address);
  } catch (error) {
    // return otherwise the function will continue executing
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    creator,
    location: coordinates,
    image:
      "https://images.pexels.com/photos/36445/rose-close-up-pink-flower.jpg?cs=srgb&dl=pexels-pixabay-36445.jpg&fm=jpg",
  });

  let user;
  try {
    // check if user exists
    user = await User.findById(creator);
  } catch (e) {
    const error = new HttpError("Creating place failed, please try again", 500);
    // must use next as we have async tasks and to pass error to next middleware that handles errors (defined in app)
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  // Below try block saves place and saves the place to the related user
  // If user id cannot be found or storing place in user fails independently from each other, undo all operations and throw error (otherwise your db will contain pieces of data that dont mean anything)
  // done through the use of sessions and transactions
  // with transaction if one of the operations fails an error is thrown and the transaction does not commit
  // when using transactions, the model will not create a collection for you. this must be done manually through the backend (MongoDB website)
  try {
    // session must be started before we can start working with transactions
    const sess = await mongoose.startSession();
    // transactions allow us to perform multiple operations in isolation of one another
    sess.startTransaction();
    await createdPlace.save({ session: sess }); // pass in object and refer to current session-
    // push method used on user (query) to establish relationship between places and user models with the created place id (add place id to user document) - this is done locally there is no interaction with the database
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction(); // save changes
  } catch (e) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  // 201 is standard for successful post request
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  const errors = validationResult(req);

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Place ID not found", 404));
  }

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const { title, description } = req.body;
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;

  // find user with place = placeid
  // remove the placeid from user.place
  // delete place

  let place;
  try {
    // populate refers to another document stored in another collection and allows us to work with data in that existing document
    // for populate to work, a relationship must be defined in Place and User schema with ref property or populate wont work
    // argument passed is the property in Place to populate. Creator references the user schema
    place = await Place.findById(placeId).populate("creator"); // find place with placeid and populates creator property with user document using id from place.creator
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not establish connection to database",
      500
    );
    return next(error);
  }

  if (!place || !places.length ) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // edits the array - does not interact with database
    // this is possible because we used populate to retrieve the place document. any changes done to the creator property will directly change the related user document
    place.creator.places.pull(placeId);
    await place.creator.save({ session: sess });
    await place.remove({ session: sess });
    await sess.commitTransaction();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    console.log(e)
    return next(error);
  }

  res.status(200).json({ message: "Deleted Place" });
};

// multiple exports syntax - exports get bundled into an object
// single item export is module.exports
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
