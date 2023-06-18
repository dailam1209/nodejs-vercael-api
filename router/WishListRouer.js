const express = require("express");
const {
    addWishList,
    updateWishList,
    getWishListData,
    removeWishData
} = require("../controller/WishListController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router.route("/add-wishlist").post(isAuthenticatedUser,addWishList);
router.route("/wishList").get(isAuthenticatedUser,getWishListData);
router.route("wishList/update/:id").put(isAuthenticatedUser,updateWishList);
router.route("/removeWishData/:id").delete(isAuthenticatedUser,removeWishData);

module.exports = router;