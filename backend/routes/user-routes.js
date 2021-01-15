const express = require('express')

const usersControllers = require('../controllers/users-controllers')

const router = express.Router()

router.get('/', usersControllers.getAllUsers);

router.post('/signup', usersControllers.signUpUser);

router.post('/login', usersControllers.loginUser);

// remember that all the routes above are methods of the router object
module.exports = router;