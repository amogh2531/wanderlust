const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/middleware.js");
const usercontroller = require("../controllers/users.js");



router.get("/signup", usercontroller.renderSignupForm);

router.post("/signup", wrapAsync(usercontroller.signup));

router.get("/login", usercontroller.renderLoginForm);

router.post("/login",
saveRedirectUrl, 
passport.authenticate("local",
{failureRedirect: "/login", failureFlash: true} ),
 usercontroller.login);

router.get("/logout", usercontroller.logout)

module.exports = router;