const express = require("express");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getPaypalSuccess } = require("../controller/PaypalController");
const {cancelPaypal} = require("../controller/PaypalController");
const {toPaypal} = require("../controller/PaypalController");



  
router.route("/to-paypal").post(toPaypal);
router.route("/cancel").get(isAuthenticatedUser, cancelPaypal);
router.route("/success").get(isAuthenticatedUser, getPaypalSuccess);


module.exports = router;