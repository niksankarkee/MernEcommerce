const router = require("express").Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { auth } = require("../middleware/auth");
const { authAdmin } = require("../middleware/AuthAdmin");

router
  .route("/category")
  .get(getCategories)
  .post(auth, authAdmin, createCategory);

router.route("/category/:id").delete(auth, authAdmin, deleteCategory);
router.route("/category/:id").put(auth, authAdmin, updateCategory);

module.exports = router;
