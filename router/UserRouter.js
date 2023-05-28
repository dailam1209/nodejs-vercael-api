const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register } = require("../controller/UserController");
const { login } = require("../controller/UserController");
const { forgotpassword } = require("../controller/UserController");
const { resetPassword } = require("../controller/UserController");
const { userDetails } = require("../controller/UserController");
const { updatePassword } = require("../controller/UserController"); 
const { updateProfile } = require("../controller/UserController");
const { isAuthenticatedUser } = require("../middleware/auth");

const CLIENT_URL = "http://localhost:3000";


router.route("/register").post(register);
router.route("/login").get(login);
router.route("/google").get( passport.authenticate("google", {scope: ['profile', 'email'] }));

router.route("/google/callback").get(passport.authenticate("google", {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
}));

router.route("/login/success").get((req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
  }
});

  
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword").post(resetPassword);
router.route("/userdetail").get(isAuthenticatedUser, userDetails);
router.route("/updatepassword").put(isAuthenticatedUser, updatePassword);
router.route("/updateprofile").get(updateProfile);


module.exports = router;