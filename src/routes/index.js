const express = require("express");
const { register, login, updateProfile, userAccounts, updateAccountState, logout, handleRefreshToken } = require("../controllers/account.controller");
const { userRequired, adminRequired } = require("../middlewares/AUTH.middleware");
const router = express.Router();


router.post("/user/register", register)
router.post("/user/login", login)
router.post("/user/updateProfile", userRequired, updateProfile)
router.get("/user/accounts", adminRequired, userAccounts)
router.put("/user/update-state", adminRequired, updateAccountState)
router.post("/user/logout", userRequired, logout)
router.post("/user/refreshtoken", handleRefreshToken)

module.exports = router;
