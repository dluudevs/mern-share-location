// Controllers - hold logic (middleware function) that should execute when a certain route is met
// Brings together the request with the model and logic that should run with request

const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  // params property holds object with dynamic routes as key value pairs eg., { placeId: 'p1' }
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  // res.json is the same as res.send it will no longer pass the request to any subsequent middleware
  if (!place) {
    // throwing an error will only work with synchronous actions - throw will also exit the function
    throw new HttpError("Could not find a place for the provided id", 404);
  }
  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => p.creator === userId);

  if (!place) {
    // passes error to error handling middleware defined in app.js
    return next(
      new Error("Could not find a place for the provided user id", 404)
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  // requires bodyparser middleware (setup in app.js)
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace)

  // 201 is standard for successful post request
  res.status(201).json({ place: createdPlace })
}

// multiple exports syntax - exports get bundled into an object
// single item export is module.exports
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;