const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersControllers.getAllUsers);

router.post(
  "/signup",
  [
    check("name").isLength({ min: 3 }),
    check("password").isLength({ min: 6 }),
    check("email")
      .normalizeEmail() //Test@test.com => test@test.com
      .isEmail(),
  ],
  usersControllers.signUpUser
);

router.post("/login", usersControllers.loginUser);

// remember that all the routes above are methods of the router object
module.exports = router;
