const express = require("express");
const router = express.Router();
const { createProduct, allProduct, getAllProduct, getSingleSameProduct, updateProduct, deleteProduct, singleProduct, searchTitle, filterProduct } = require("../controller/ProductController");

router.route("/createproduct").post(createProduct);
router.route("/allproduct").get(allProduct);
router.route("/search").get(searchTitle);
router.route("/getAllProduct").get(getAllProduct);
router.route("/getSingleSameProduct/:id").get(getSingleSameProduct);
router.route("/updateProduct/:id").put(updateProduct);
router.route("/deleteProduct/:id").put(deleteProduct);
router.route("/singleProduct/:id").get(singleProduct);



module.exports = router;