var Campground = require("../models/campground")
var Comment = require("../models/comment")


var middlewareObject = {};

middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}


middlewareObject.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect("back")
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back")
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
}


middlewareObject.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back")
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
}
module.exports = middlewareObject;