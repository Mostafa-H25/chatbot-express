const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const jsonc = require("jsonc");
const pool = require("../database");

const router = express.Router();

router.use(bodyParser.json());

// Authentication
// Registration
router.post("/register", (req, res) => {
  // retrieve data sent from the frontend
  const username = req.body.user.username;
  const email = req.body.user.email;
  const password = req.body.user.password;
  const confirmPassword = req.body.user.confirmPassword;
  const userCategory = req.body.user.userCategory;

  //  check if passwords match
  if (!password === confirmPassword) {
    return res.status(400).json({ message: "The passwords doesn't match." });
  }

  // check if password is equal to or more than 8 characters
  if (password.length <= 8) {
    return res
      .status(400)
      .json({ message: "The passwords should be 8 or more characters." });
  }

  // check if username field is not empty
  if (username.length < 1) {
    return res.status(400).json({ message: "The username field is empty." });
  }

  // check if email field is not empty
  if (email.length < 1) {
    return res.status(400).json({ message: "The email field is empty." });
  }

  // check if email is in the right syntax
  if (!email.includes("@")) {
    return res.status(400).json({ message: "The email field is invalid." });
  }

  // generate user data
  const isVerified = true;
  const createdAt = new Date();

  // save user in database
  pool.query(
    "Insert Into user(username, email, password, user_category, created_at, is_verified) Values(?,?,?,?,?,?)",
    [username, email, password, userCategory, createdAt, isVerified],
    (err, result, fields) => {
      if (err) {
        throw err;
      } else {
        return result;
      }
    }
  );

  // return to frontend that user has been registered successfully
  res.status(201).json({
    message:
      "User has been registered successfully. Please check your mail for verification link.",
  });
});

// Login
router.post("/login", (req, res) => {
  // retrieve data sent from the frontend
  const email = req.body.user.email;
  const password = req.body.user.password;

  // verify that data fields is not empty
  if (!email || !password) {
    res.status(400).json({ message: "User data is incomplete." });
  }

  // retrieve user by email
  const user = pool.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
        // return res
        //   .status(404)
        //   .json({ message: "User email is not found in the database." });
      }
      // console.log("result", Object.values(result[0]));
      return result;
    }
  );
  res.send(jsonc.stringify(user));

  // check if passwords match
  // if (user.password !== password) {
  //   return res.status(404).json({ message: "User password is invalid." });
  // }
  // // generate access token
  // const token = crypto.randomUUID();

  // // save token in db
  // pool.query(
  //   "Insert Into token(user_id, token, is_active) Values(?,?,true)",
  //   [user_id, token],
  //   (err, result, fields) => {
  //     if (err) {
  //       return console.log(err);
  //     }
  //     return result;
  //   }
  // );

  // // redirect user to home page with authorization token
  // res.status(200).header({ authorization: token }).redirect("/");
});

// Logout
router.post("/logout", (req, res) => {
  // retrieve token from header
  const token = req.header.authorization;
  // disable token
  pool.query(
    "Update token Set is_active=false where token = ?",
    [token],
    (err, result, fields) => {
      if (err) {
        return console.log(err);
      }
      return result;
    }
  );

  // confirm that token has been invalidated
  res.status(200).json({ message: "User has been signed out." });
});

module.exports = router;
