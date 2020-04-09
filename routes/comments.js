var express = require("express");
var router = express.Router({ mergeParams: true });
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render("comments/new", { campground: campground })
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", "Something went wrong!")
            res.redirect("back")
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "New comment added!")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {

    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment })
        }
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {

    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("No campground found with given ID");
            return res.redirect("back")
        }

        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
            if (err) {
                res.redirect("back");
            }
            else {
                req.flash("success", "Comment successfully updated!")
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })




})


router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {


    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment successfully deleted!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router;