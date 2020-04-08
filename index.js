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
var User = require("./models/user");

var commentRoute = require("./routes/comments");
var campgroundRoute = require("./routes/campgrounds");
var authRoute = require("./routes/auth");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//CONFIGS
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");


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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use("/", authRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/campgrounds", campgroundRoute);

app.listen(3000, () => {
    console.log("Running!");
});
