const express = require("express");
const router = express.Router();

const {
    changeWishList,
    getAllWishList
} = require("../controller/WishListController");
const { isAuthenticatedUser } = require("../middleware/auth");


router.route("/change-wishlist").post(isAuthenticatedUser,changeWishList);
router.route("/get-list/:id").get(isAuthenticatedUser,getAllWishList);

module.exports = router;