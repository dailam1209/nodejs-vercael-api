const express = require("express");
const {
    addCart,
    updateCart,
    getCartData,
    removeCartData
} = require("../controller/CartController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/add-cart").post(addCart);
router.route("/:id").get(getCartData);
router.route("/update-cart").post(updateCart);
router.route("/remove-cart").post(removeCartData);


module.exports = router;