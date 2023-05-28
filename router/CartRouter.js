const express = require("express");
const {
    addCart,
    updateCart,
    getCartData,
    removeCartData,
    addWishList,
    updateWishList,
    getWishListData,
    removeWishData
} = require("../controller/CartController");

const router = express.Router();

router.route("/addCart").post(addCart);
router.route("/cart").get(getCartData);
router.route("cart/update/:id").put(updateCart);
router.route("/removeCart/:id").delete(removeCartData);

router.route("/addWishList").post(addWishList);
router.route("/wishList").get(getWishListData);
router.route("wishList/update/:id").put(updateWishList);
router.route("/removeWishData/:id").delete(removeWishData);

module.exports = router;