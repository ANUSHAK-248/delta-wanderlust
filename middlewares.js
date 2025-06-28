module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in")
        return res.redirect("/user/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);    
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


const Listing = require("./models/listing.js")
module.exports.isOwner = async (req, res, next) => {
    const id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Listing");
        res.redirect(`/listing/show/${id}`);
        return;
    }
    next();
}


const Review = require("./models/review.js")
module.exports.isReviewOwner = async (req, res, next) => {
    const {lid, rid} = req.params;
    let review = await Review.findById(rid);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Review");
        res.redirect(`/listing/show/${lid}`);
        return;
    }
    next();
}