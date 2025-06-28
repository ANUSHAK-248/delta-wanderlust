const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {savedRedirectUrl} = require("../middlewares.js")

const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignupPage )
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginPage)
.post(savedRedirectUrl,
    passport.authenticate("local", {failureRedirect : "/user/login", failureFlash : true}) , userController.login)

router.get("/logout", userController.logout )


module.exports = router; 