const Review = require("../models/review.js");
const Listing = require ("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);    
    if(listing && newreview){
        newreview.author = req.user._id;
        listing.reviews.push(newreview);    
        await newreview.save();
        await listing.save();
        console.log(`new review \" ${newreview.comment} \" saved for  \" ${listing.title} \"`);
    }
    req.flash("success", "Review Created Successfully");
    res.redirect(`/listing/show/${listing._id}`);
}

module.exports.deleteReview =  async (req, res) => {
    let {lid, rid} = req.params;
    let listing = await Listing.findById(lid);
    let review = await Review.findById(rid);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
        return;
    }
    if(!review){
        req.flash("error", "Review you tried to delete does not exist");
        res.redirect("/listings");
        return;
    }
    await Listing.findByIdAndUpdate(lid, {$pull: {reviews : rid}});
    console.log(`removed the review \" ${review.comment} \" from the listing  \" ${listing.title} \" `);
    await Review.findByIdAndDelete(rid);
    console.log(`Deleted the review \" ${review.comment} \" permanently`);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/listing/show/${listing._id}`);
}
