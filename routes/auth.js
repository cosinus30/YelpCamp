var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
})

router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Yelpcamp " + user.username)
            res.redirect("/campgrounds");
        })
    })
})


router.get("/login", (req, res) => {
    res.render("login");
})

router.post("/login",
    passport.authenticate("local",
        {
            successFlash: "It is nice to see you here!",
            successRedirect: "/campgrounds",
            failureFlash: "Well, interesting",
            failureRedirect: "/login"

        }))

//logout
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
})

module.exports = router;