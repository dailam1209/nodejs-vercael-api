const express = require("express");
const {
    createOrder,
    getAllOrder
} = require("../controller/OrderController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/create-order").post(isAuthenticatedUser, createOrder);
router.route("/:id").get(isAuthenticatedUser,getAllOrder);

module.exports = router;