var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");


// TODO Get all campgrounds of user, send it to the campgrounds on user!
router.get("/", middleware.isLoggedIn, (req, res) => {
    Campground.find({ 'author.id': req.user._id }, (err, foundCampgrounds) => {
        if (err) {
            req.flash("error", "Something went wrong!")
        }
        else {
            res.render("user/dashboard", { campgrounds: foundCampgrounds })
        }
    })
})

module.exports = router;
