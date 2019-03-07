const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

let checkAuthOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, data) => {
            if (err) {
                res.redirect("back");
            } else {
                if (data.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
};

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", {data:campgrounds});
        }
    });
});

router.post("/", isLoggedIn, (req, res) => {
    let name =  req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {id: req.user._id, username: req.user.username};
    let newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show.ejs", {campground: result});
        }
    });
});

router.get("/:id/edit", checkAuthOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, data) => {
        if (err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/edit.ejs", {campground: data});
        }
    });
});

router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", checkAuthOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;