const express = require("express");
const { register, login, updateProfile, userAccounts, updateAccountState, logout, handleRefreshToken, registerAd, checkUserToken } = require("../controllers/account.controller");
const { adminRequired, userRequired } = require("../middlewares/auth.middleware");
const router = express.Router();


router.post("/user/register", register)
router.post("/user/registerAd", registerAd)
router.post("/user/login", login)
router.post("/user/updateProfile", userRequired, updateProfile)
router.get("/user/accounts", adminRequired, userAccounts)
router.put("/user/update-state", adminRequired, updateAccountState)
router.post("/user/logout", userRequired, logout)
router.post("/user/refreshtoken", handleRefreshToken)
router.post("/user/check",userRequired, checkUserToken)

module.exports = router;
