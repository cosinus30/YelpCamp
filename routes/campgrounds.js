var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


router.get("/", (req, res) => {

    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/index", { campgrounds: allCampgrounds });
        }
    });
});

//one is get one is post
router.post("/", isLoggedIn, (req, res) => {
    //retrieve data from form
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var description = req.body.campground.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
    }
    //create a new campground and save to DB
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            //redirect to the get campgrounds page.
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campground/new");
});


//SHOW ROUTE
router.get("/:id", (req, res) => {
    //find the campground with provided id
    //render that item.
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/show", { campground: foundCampground });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}

module.exports = router;