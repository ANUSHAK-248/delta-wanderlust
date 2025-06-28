const express = require("express");
const router = express.Router({mergeParams: true});
//  originally if the basic common route in app.js has any param then they are not passed, but by mergeParams the are
const wrapAsync = require("../utils/wrapAsync.js")
const{validateListing, isLoggedIn, isOwner, validateReview, isReviewOwner} = require("../middlewares.js");

const reviewController = require("../controllers/review.js")
 
// Create review for a listing
router.post("/save/:id/", isLoggedIn, validateReview, wrapAsync( reviewController.createReview ))

// Deleting review 
router.delete("/delete/:lid/:rid",isLoggedIn, isReviewOwner,  wrapAsync( reviewController.deleteReview));

module.exports = router;