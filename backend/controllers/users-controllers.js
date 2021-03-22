const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    // second argument is called a projection. query will only return these properties
    // here we are excluding the password property
    users = await User.find({}, '-password');
  } catch (e) {
    return next(new HttpError('Could not fetch users', 500));
  }

  users = users.map( user => user.toObject({ getters: true }));
  // By default status code 200 is sent back on successful requests
  res.status(200).json({ users })
};

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data", 422));
  }

  const { name, password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Unable to connect with database", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "This email address already has an account",
      422
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image:
      "https://images.pexels.com/photos/5861322/pexels-photo-5861322.jpeg?cs=srgb&dl=pexels-athena-5861322.jpg&fm=jpg",
    password,
    places: []
  });

  try {
    await newUser.save();
  } catch (e) {
    const error = new HttpError("Creating user failed, please try again", 500);
    // must use next as we have async tasks and to pass error to next middleware that handles errors (defined in app)
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  
  let user;
  try {
    user = await User.findOne({ email });
  } catch (e) {
    return new HttpError(
      "Could not connect to server, please try again later",
      500
    );
  }

  if (!user) {
    return next(new HttpError("Email not found", 404));
  }

  if (password !== user.password) {
    return next(new HttpError("Password is incorrect", 401));
  }

  // pass user object so we can access the ID - convert to object so it can be used with JavaScript
  return res.json({ message: "Login Successful!", user: user.toObject({ getters: true }) });
};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
