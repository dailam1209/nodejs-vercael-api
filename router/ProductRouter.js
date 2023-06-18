const express = require("express");
const router = express.Router();
const { createProduct, allProduct, getAllProduct, getSingleSameProduct, updateProduct, deleteProduct, singleProduct, searchTitle, filterProduct } = require("../controller/ProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/createproduct").post(isAuthenticatedUser, authorizeRoles("admin"),createProduct);
router.route("/allproduct").get(allProduct);
router.route("/search").get(searchTitle);
router.route("/:slug").get(getAllProduct);
router.route("/getSingleSameProduct/:id").get(getSingleSameProduct);
router.route("/updateProduct/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct);
router.route("/deleteProduct/:id").put(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct);
router.route("/singleProduct/:id").get(singleProduct);



module.exports = router;