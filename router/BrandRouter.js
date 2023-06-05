const express = require("express");
const router  = express.Router();

const { addBrand } = require("../controller/BrandController");
const { deleteBrand } = require("../controller/BrandController");
const { getABrand } = require("../controller/BrandController");
const { getAllBrand } = require("../controller/BrandController");
const { updateBrand } = require("../controller/BrandController");

 
router.route("/add-brand").post(addBrand);
router.route("/delete-brand/:id").put(deleteBrand);
router.route("/get-brand/:id").get(getABrand);
router.route("/getlist-brand").get(getAllBrand);
router.route("/update-brand/:id").post(updateBrand);

module.exports = router;
