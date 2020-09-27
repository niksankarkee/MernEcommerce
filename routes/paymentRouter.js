const router = require("express").Router();
const {
  getPayments,
  createPayment,
} = require("../controllers/paymentController");
const { auth } = require("../middleware/auth");
const { authAdmin } = require("../middleware/AuthAdmin");

router.route("/payment").get(auth, getPayments).post(auth, createPayment);

module.exports = router;
