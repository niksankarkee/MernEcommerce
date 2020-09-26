const router = require("express").Router();

const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.route("/products").get(getProducts).post(createProduct);

router.route("/products/:id").delete(deleteProduct).put(updateProduct);

module.exports = router;
