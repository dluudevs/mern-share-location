const express = require("express");
const bodyParser = require("body-parser");

// express can now use this object as a middleware (exports are objects)
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error")

const app = express();

// middleware parsed from top to bottom

// before passing to routes, parse any incoming requests body and extract json data
// data available in req.body
app.use(bodyParser.json())

// register as middleware by default all requests will go through this middleware (check for route matches)
// by passing the path as an argument, express will only forward requests to placesRoutes middleware IF the path starts with the string in the path argument
// eg., /api/places/... - this does NOT have to be repeated in placesRoutes. Only add the path after the path argument
app.use("/api/places", placesRoutes);

// this middleware function will only run if no request is sent back. otherwise the placesRoutes middleware will handle all requests
// when a response is sent back, the request is no longer passed to any later middleware. 
// no response is sent back when an incorrect route is used
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
})

// just like the above middleware function, this only runs when a response is not sent back or error occurs in route handling middleware
// all requests will be passed through this middleware (because it is a error handling middleware that sits after route handling middleware)
// by passing 4 arguments to the callback, express will recognize this as a error handling middleware function
app.use((error, req, res, next) => {
  // checks if headers (response) have been sent
  if (res.headerSent) {
    // forward the error that arises from any of the route middleware
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error has occured!" });
});

app.listen(5000);
