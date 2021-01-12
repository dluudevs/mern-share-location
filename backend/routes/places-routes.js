const express = require("express");

// object returned from multiple exports
const placesControllers = require('../controllers/places-controllers')

// returns an object
const router = express.Router();

// Only need to reference function as they are callbacks
// GOTCHA - order of the routes matter. fetching from api/places/user will get picked up by :placeId because express thinks 'user' is the dynamic value
// theres no problem here because our middleware handles the error and users will always be user/:uid
router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

module.exports = router;
