const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const config = require("./config");

let app = express();
mongoose.connect(config.mongodb_uri, { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

app.get("/", (req, res) => {
    res.render("landing.ejs");
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index.ejs", {data:campgrounds});
        }
    });
});

app.post("/campgrounds", (req, res) => {
    let name =  req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show.ejs", {campground: result});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is running.");
});