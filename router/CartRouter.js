const express = require("express");
const {
    addCart,
    updateCart,
    getCartData,
    removeCartData
} = require("../controller/CartController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/add-cart").post(isAuthenticatedUser,addCart);
router.route("/:id").get(isAuthenticatedUser,getCartData);
router.route("/update-cart").post(isAuthenticatedUser,updateCart);
router.route("/remove-cart").put(isAuthenticatedUser,removeCartData);


module.exports = router;