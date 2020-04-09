var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

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
router.post("/", middleware.isLoggedIn, (req, res) => {
    //retrieve data from form1
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

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campground/new");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found!");
            res.redirect("back")
        } else {
            res.render("campground/show", { campground: foundCampground });
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campground/edit", { campground: foundCampground })
    });
})

router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds")
        }
        else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router;