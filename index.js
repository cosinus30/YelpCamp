var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override")
var flash = require("connect-flash");

//MODELS
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

//ROUTES
var commentRoute = require("./routes/comments");
var campgroundRoute = require("./routes/campgrounds");
var authRoute = require("./routes/auth");
var userRoute = require("./routes/user");

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


//CONFIGS
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

//ROUTES
app.use("/", authRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Running!");
});
