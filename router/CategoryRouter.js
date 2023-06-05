const express = require("express");
const router  = express.Router();

const { addCategory } = require("../controller/CategoryController");
const { deleteCategory } = require("../controller/CategoryController");
const { getACategory } = require("../controller/CategoryController");
const { getAllCategory } = require("../controller/CategoryController");
const { updateCategory } = require("../controller/CategoryController");

 
router.route("/add-category").post(addCategory);
router.route("/delete-category/:id").put(deleteCategory);
router.route("/get-category/:id").get(getACategory);
router.route("/getlist-category").get(getAllCategory);
router.route("/update-category/:id").post(updateCategory);

module.exports = router;
