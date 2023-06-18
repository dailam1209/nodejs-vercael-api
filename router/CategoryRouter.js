const express = require("express");
const router  = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const { addCategory } = require("../controller/CategoryController");
const { deleteCategory } = require("../controller/CategoryController");
const { getACategory } = require("../controller/CategoryController");
const { getAllCategory } = require("../controller/CategoryController");
const { updateCategory } = require("../controller/CategoryController");

 
router.route("/add-category").post(isAuthenticatedUser, authorizeRoles("admin"),addCategory);
router.route("/delete-category/:id").put(isAuthenticatedUser, authorizeRoles("admin"),deleteCategory);
router.route("/get-category/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getACategory);
router.route("/getlist-category").get(isAuthenticatedUser, authorizeRoles("admin"),getAllCategory);
router.route("/update-category/:id").post(isAuthenticatedUser, authorizeRoles("admin"),updateCategory);

module.exports = router;
