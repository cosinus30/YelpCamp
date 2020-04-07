var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDb = require("./seeddb");
var passport = require("passport");
var localStrategy = require("passport-local");

seedDb();
//MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//CONFIGS
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

//Passport Config
app.use(require("express-session")({
    secret: "This is fucking weird!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {

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
// !               COMMENTS                 !
// ! ====================================== !

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
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

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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

// ! =================================
app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        })
    })
})


app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login",
    passport.authenticate("local",
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }))

//logout
app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect("/login");
    }
}


app.listen(3000, () => {
    console.log("Running!");
});
