const router = require("express").Router();
const {
  userRegister,
  refreshToken,
  userLogin,
  userLogout,
  getUser,
  addCart,
  getHistory
} = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/logout", userLogout);

router.get("/refresh_token", refreshToken);

router.get("/infor", auth, getUser);

router.patch("/addcart", auth, addCart);

router.get("/history", auth, getHistory);

module.exports = router;
