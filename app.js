if(process.env.NODE_ENV  != "production"){
    require('dotenv').config();
}
const express = require("express");
const app= express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { off } = require("process");

const mongo_url = 'mongodb://127.0.0.1:27017/wonderlust';


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


main()
    .then( () =>{
        console.log("connected to db");
    })
    .catch((err) =>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(mongo_url);
};

const sessionOptions = {
    secret: "mysuperscretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req, res) =>{
//     res.send("hi I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate() ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash middleware
app.use((req, res, next) =>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    next();
});

// app.get("/demouser", async(ewq, res) =>{
//     let fakeUser = new User({
//         email:"test@abc.com",
//         username:"delta"
//     });

//     let registeredUser= await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
    
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found"));
});

//error middleware
app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong "} = err
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err});
});

app.listen(8080, () => {
    console.log("server is listening on 8080");
});
