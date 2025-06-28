if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express"); 
const app = express(); 
const port = 8080; 

const path = require("path"); 
app.set("view engine", "ejs"); // use ejs instead of html
app.set("views", path.join(__dirname, "views")); // for views folder

app.use(express.urlencoded({extended : true})); // to let data coming in request be parsed 

const mongoose = require("mongoose"); 
// const mongo_offline_url = 'mongodb://127.0.0.1:27017/wanderlust'; // mongo offline computer database
const mongo_online_url = process.env.MONGO_URL; // mongo onine database, required in main function

const Listing = require ("./models/listing.js");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate"); // for boilerplates
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public"))) // for css and js static files

const wrapAsync = require("./utils/wrapAsync.js")



const cookieParser= require("cookie-parser");
app.use(cookieParser(process.env.cookieSecret));

const MongoStore = require("connect-mongo")
const store = MongoStore.create({
    mongoUrl : mongo_online_url,
    crypto : {
        secret : process.env.sessionSecret
    },
    touchAfter: 24*3600, // in sec
}
);

store.on("error", () => {
    console.log("Error in mongo session store ", err);
})

const session = require("express-session")
const sessionOptions = {
    store: store,
    secret : process.env.sessionSecret, 
    resave : false, 
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7, // takes precedence over expires
        httpOnly: true, // security prevents  cross-scripting attacks
    }
}
app.use(session(sessionOptions));


const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user.js");
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Serialisation - storing info of user into the session 
// Deserialisation - deletion info of user from the session

const flash = require("connect-flash")
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})





//  ------------------------------------------------LISTINGS' ROUTES---------------------------------------------------------

app.get("/",  (req, res) =>{
    res.redirect("/listings");
})
app.use(express.json());
// Shows all the listings initially
app.get("/listings", wrapAsync(async (req, res) => {

    let searchvalue = "";
    let criteriavalue = "title";
   
    const allListings = await Listing.find({}); // {} is neccessary inside () to get all data
    res.render("listings/index.ejs", { searchvalue, criteriavalue,  allListings});
}))
// Shows the searched listing
app.post("/showlist", async (req, res)=>{
   
    const { searchvalue, criteriavalue } = req.body;
    let array = await Listing.find({});

    let filteredListings = [];

    function filtering() {
        if (searchvalue === "") {
            filteredListings = array; // show all if empty
        }
        else if (criteriavalue === "title") {
            filteredListings = array.filter(listing =>
                listing.title.toLowerCase().includes(searchvalue.toLowerCase())
            );
        }
        else if (criteriavalue === "location") {
            filteredListings = array.filter(listing =>
                listing.location.toLowerCase().includes(searchvalue.toLowerCase())
            );
        }
        else if (criteriavalue === "country") {
            filteredListings = array.filter(listing =>
                listing.country.toLowerCase().includes(searchvalue.toLowerCase())
            );
        }
    }
    await filtering();

    res.render("listings/index2.ejs", { allListings: filteredListings }, (err, html) => {
        if (err) {
            console.error("Rendering error:", err);
            return res.status(500).send("Template render error");
        }
        // console.log("html", html);
        res.send( {html} );
    });
})

// --------------------------------------------------------------
const listingRouter = require("./routes/listing.js");
app.use("/listing", listingRouter);




//  --------------------------------------------------REVIEWS' ROUTES------------------------------------------------------------

const reviewRouter = require("./routes/review.js");

app.use("/review", reviewRouter);




//  --------------------------------------------------REVIEWS' ROUTES------------------------------------------------------------

const userRouter = require("./routes/user.js");

app.use("/user", userRouter);





// app.all('/{*any}', (req, res, next) => {
//     next(new ExpressError(404,"Page not found"));
// });

//  Error sending middlewares
app.use((err, req, res, next)=>{
    console.log(err.name);
    console.log(err.stack);
    console.log(err);
    
    // res.status(status).send(message);
    res.render("error.ejs",{err});
})

async function main(){
    // await mongoose.connect(mongo_offline_url);
    await mongoose.connect(mongo_online_url);
}

main()
    .then(() => {
        console.log("successfully connected to mongo DB");
    })
    .catch(err => {
        console.log("error in connecting to mongo DB ",err);
    })


app.listen(port, (req,res) => {
    console.log(`app is litening on port ${port}`);
})

