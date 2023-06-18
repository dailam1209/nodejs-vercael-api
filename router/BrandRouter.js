const express = require("express");
const router  = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const { addBrand } = require("../controller/BrandController");
const { deleteBrand } = require("../controller/BrandController");
const { getABrand } = require("../controller/BrandController");
const { getAllBrand } = require("../controller/BrandController");
const { updateBrand } = require("../controller/BrandController");

 
router.route("/add-brand").post(isAuthenticatedUser, authorizeRoles("admin"),addBrand);
router.route("/delete-brand/:id").put(isAuthenticatedUser, authorizeRoles("admin"),deleteBrand);
router.route("/get-brand/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getABrand);
router.route("/getlist-brand").get(isAuthenticatedUser, authorizeRoles("admin"),getAllBrand);
router.route("/update-brand/:id").post(isAuthenticatedUser, authorizeRoles("admin"),updateBrand);

module.exports = router;
