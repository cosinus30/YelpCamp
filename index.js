var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDb = require("./seeddb");

seedDb();
//MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//CONFIGS
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    // res.render("campgrounds", { campgrounds: campgrounds });
    //Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/index", { campgrounds: allCampgrounds });
        }
    });
});

//one is get one is post
app.post("/campgrounds", (req, res) => {
    //retrieve data from form
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var description = req.body.campground.description;
    var newCampground = { name: name, image: image, description: description }
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

app.get("/campgrounds/new", (req, res) => {
    res.render("campground/new");
});


//SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
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

// ! ====================================== !

app.get("/campgrounds/:id/comments/new", (req, res) => {
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

app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})


app.listen(3000, () => {
    console.log("Running!");
});
