const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: 'u1',
    username: 'delvv',
    password: 'temp123',
    email: 'delvv@gmail.com'
  }
]

const getAllUsers = (req, res, next) => {
  // By default status code 200 is sent back on successful requests 
  res.json({ users: DUMMY_USERS })
}

const signUpUser = (req, res, next) => {
  const { username, password, email } = req.body
  const userExists = DUMMY_USERS.find( user => user.email === email )

  if (userExists) {
    throw new HttpError('This email address already has an account', 400)
  }

  const newUser = { id: uuidv4(), username, password, email };

  DUMMY_USERS.push(newUser)
  res.status(201).json({ user: newUser });
}

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find( user => user.email === email );

  if (!user) {
    throw new HttpError('Email not found', 404)
  }

  if ( password === user.password ) {
    return res.json({ message: "Login Successful!" });
  } else {
    throw new HttpError('Password is incorrect', 401)
  }
}

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
