const axios = require("axios");

const HttpError = require("../models/http-error");
const API_KEY = "AIzaSyD4GA6fFdkocbluhL5bYunym0RYoHQqCVw";

const geocode = async (address) => {
  // encodeURIComponent is a global function available in javascript and nodejs
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Could not find location for the specified address', 422);
    throw error;
  } 

  const coordinates = data.results[0].geometry.location;
  console.log(coordinates)

  // Async function will always return a promise. If it is not explicity a promise, the value will be implicity wrapped into one
  return coordinates;
};

module.exports = geocode; 
