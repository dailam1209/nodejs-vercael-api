const express = require("express");
const router = express.Router();
const passport = require("passport");
const { register, logout, changeUser, checkCode, deleteCode } = require("../controller/UserController");
const { login } = require("../controller/UserController");
const { forgotpassword } = require("../controller/UserController");
const { resetpassword } = require("../controller/UserController");
const { getUser } = require("../controller/UserController");
const { getAllUser } = require("../controller/UserController");
const { updatePassword } = require("../controller/UserController"); 
const { updateProfile } = require("../controller/UserController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { deleteUser } = require("../controller/UserController")

const CLIENT_URL = "http://localhost:3000";


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
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
router.route("/resetpassword").post(resetpassword);
router.route("/check-code").post(checkCode);
router.route("/delete-code").post(deleteCode);
router.route("/user/:id").get(isAuthenticatedUser, getUser);
router.route("/alluser").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/updatepassword").put(isAuthenticatedUser, authorizeRoles("admin"), updatePassword);
router.route("/updateprofile").post(isAuthenticatedUser,updateProfile);
router.route("/deleteuser/:id").put(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/changeuser/:id").put(isAuthenticatedUser, authorizeRoles("admin"), changeUser);


module.exports = router;