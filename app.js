const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");

const indexRoute = require("./routes/index");
const campgroundsRoute = require("./routes/campgrounds");
const commentsRoute = require("./routes/comments");

const seedDB = require("./seeds");
const config = require("./config");

let app = express();
mongoose.connect(config.mongodb_uri, { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
//auth
app.use(require("express-session")({
    secret: "secret-text",
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
});

app.use(indexRoute);
app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/comments",commentsRoute);

// seedDB();

let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is running.");
});