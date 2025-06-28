const express = require("express");
const router = express.Router({mergeParams: true});
//  originally if the basic common route in app.js has any param then they are not passed, but by mergeParams the are
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require ("../models/listing.js");
const{validateListing, isLoggedIn, isOwner, validateReview} = require("../middlewares.js");

const listingController = require("../controllers/listing.js")
const multer = require("multer");
// const upload = multer({dest : "uploadfolder/"}) // to upload locally
const {cloudinary, storage} = require("../cloudConfig.js");
const upload = multer({ storage})



// Show Listing page
router.get("/show/:id",wrapAsync( listingController.showListing ))

// New Listing Page
router.get("/new", isLoggedIn, (wrapAsync(  listingController.renderNewForm)));
// Route to save the newly created listing
router.post("/save",isLoggedIn, validateListing, upload.single("listing[imagefile]"), wrapAsync ( listingController.savenew));
// router.post("/save", upload.single("listing[imagefile]"), (req, res) => {res.send(req.file)}); // sample for file upload
// req.file sends us data related to the file uploaded

// Edit Listing page
router.get("/edit/:id", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm))
// Save changes post editting
router.put("/savechanges/:id", isLoggedIn, isOwner, upload.single("listing[imagefile]"),  validateListing, wrapAsync( listingController.savechanges ))  

// Delete Route
router.delete("/delete/:id", isLoggedIn, isOwner, wrapAsync( listingController.deleteListing))

module.exports = router;
