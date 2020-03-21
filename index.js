var express = require("express");
var app = express();
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

app.listen(3000, () => {
    console.log("Running!");
});
