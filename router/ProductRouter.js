const express = require("express");
const router = express.Router();
const { createProduct, allProduct, getAllProduct, getSingleSameProduct, updateProduct, deleteProduct, singleProduct } = require("../controller/ProductController");

router.route("/createproduct").post(createProduct);
router.route("/allproduct").get(allProduct);
router.route("/getAllProduct/:id").get(getAllProduct);
router.route("/getSingleSameProduct/:id").get(getSingleSameProduct);
router.route("/updateProduct/:id").put(updateProduct);
router.route("/deleteProduct/:id").put(deleteProduct);
router.route("/singleProduct/:id").get(singleProduct);



module.exports = router;