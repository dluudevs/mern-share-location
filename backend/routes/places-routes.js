const express = require("express");
const { check } = require("express-validator");

// object returned from multiple exports
const placesControllers = require("../controllers/places-controllers");

// returns an object
const router = express.Router();

// Only need to reference function as they are callbacks
// GOTCHA - order of the routes matter. fetching from api/places/user will get picked up by :placeId because express thinks 'user' is the dynamic value
// theres no problem here because our middleware handles the error and users will always be user/:uid
router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

// can pass more than one middleware to route, they will run in order from left to right
// check for validity before passing it to controller middleware - check returns a middleware function, that is why it is being called here
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:placeId", placesControllers.deletePlace);

module.exports = router;
