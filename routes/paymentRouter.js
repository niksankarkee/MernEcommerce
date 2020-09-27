const router = require("express").Router();
const {
  getPayments,
  createPayment,
} = require("../controllers/paymentController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/AuthAdmin");

router
  .route("/payment")
  .get(auth, authAdmin, getPayments)
  .post(auth, authAdmin, createPayment);

module.exports = router;
