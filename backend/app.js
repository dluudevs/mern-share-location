// Basic idea of express: all callbacks are middleware functions
// the request is passed from middleware function to middleware function until a response is sent back in which case the response no longer gest passed to the succeeding middlware function
// if passing the request along to another middleware function, next MUST be called or the response will be left hanging
const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

// express can now use this object as a middleware (exports are objects)
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const app = express();

// middleware parsed from top to bottom

// before passing to routes, parse any incoming requests body and extract json data
// data available in req.body
app.use(bodyParser.json());

// add middleware that attaches appropriate headers to work around CORS (cross origin resource sharing) error
// By default browser restricts CORS Http requests (server origin and requesting code origin is different) Front end can only request resources if the appropriate headers are attached in the response headers
app.use((req, res, next) => {
  // set headers on response - each method call takes a key and a value (2 arguments)
  res.setHeader("Access-Control-Allow-Origin", "*"); // '*' value tells browsers to allow requesting code from any origin to access the resource. If an origin is specified, only if the requesting code contains the specified origin may access the resource
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); // which headers incoming requests may have so they are handled
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// register as middleware by default all requests will go through this middleware (check for route matches)
// by passing the path as an argument, express will only forward requests to placesRoutes middleware IF the path starts with the string in the path argument
// eg., /api/places/... - this does NOT have to be repeated in placesRoutes. Only add the path after the path argument
app.use("/api/places", placesRoutes);

app.use("/api/users", userRoutes);

// this middleware function will only run if no request is sent back. otherwise the placesRoutes middleware will handle all requests
// when a response is sent back, the request is no longer passed to any later middleware.
// no response is sent back when an incorrect route is used
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

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

mongoose
  .connect(
    "mongodb+srv://delvv:369Dluuml@cluster0.1hdzc.mongodb.net/places?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
