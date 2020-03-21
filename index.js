var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ encoded: true }));

var campgrounds = [
    {
        name: "Salmon Creek",
        image:
            "https://www.nps.gov/grba/planyourvisit/images/tent-and-aspens-Robb.jpg?maxwidth=650&autorotate=false"
    },
    {
        name: "Salmon Creek",
        image:
            "https://www.nps.gov/grba/planyourvisit/images/tent-and-aspens-Robb.jpg?maxwidth=650&autorotate=false"
    },
    {
        name: "Salmon Creek",
        image:
            "https://www.nps.gov/grba/planyourvisit/images/tent-and-aspens-Robb.jpg?maxwidth=650&autorotate=false"
    },
    {
        name: "Salmon Creek",
        image:
            "https://www.nps.gov/grba/planyourvisit/images/tent-and-aspens-Robb.jpg?maxwidth=650&autorotate=false"
    },
    {
        name: "Salmon Creek",
        image:
            "https://www.nps.gov/grba/planyourvisit/images/tent-and-aspens-Robb.jpg?maxwidth=650&autorotate=false"
    }
];

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", { campgrounds: campgrounds });
});

//one is get one is post
app.post("/campgrounds", (req, res) => {
    //retrieve data from form
    var name = req.body.name;
    var image = req.body.image;

    //push to the array
    var newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    //redirect to the get campgrounds page.
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.listen(3000, () => {
    console.log("Running!");
});
