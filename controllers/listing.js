const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
});

const Listing = require ("../models/listing.js");

module.exports.showListing = async (req,res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
        return;
    }
    res.render("listings/show.ejs", {listing : listing});
}

module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.savenew = async (req, res) => {
    listing = new Listing(req.body.listing);    
    
    listing.owner = req.user._id;

    let url=""; 
    let filename=""
    if(req.file){
        url = req.file.path;
        filename = req.file.filename;
        listing.image.filename = filename;
        listing.image.url = url;
    }else{
        listing.image.url = req.body.listing.image;
    }    
    // console.log(` post modelling \n : ${listing}`);    
    listing  = await listing.save()
    if(listing){
        console.log(`Successfully created and saved the new listing ${listing.title}`)
    }else{
        console.log(`Failed to create a new listing`);
        return;
    }    
    req.flash("success", "Listing Created Successfully");
    let id = listing._id;
    res.redirect(`/listing/show/${id}`)
}

module.exports.renderEditForm = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    let originalImageURL = listing.image.url;
    originalImageURL.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing : listing, originalImageURL });
}
module.exports.savechanges = async (req, res) => {
    const id = req.params.id;
    let listing = await Listing.findById(id);
    
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
        return;
    }
    try{
        let oldimgfilename = listing.image.filename;
        console.log("old file name = ",oldimgfilename);
        let oldimgurl = listing.image.url;
        console.log("old file url = ",oldimgurl);
        console.log("");
        listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
        console.log("old listing = ",listing);
        console.log("");

        async function update(){
        if(req.file){
            // New file's Data
            newurl = req.file.path;
            newfilename = req.file.filename;
            function deletefile(){
            //  Delete previous image
            cloudinary.uploader.destroy(`${oldimgfilename}`, function (error, result) {
                if (error) return console.error(error);
                console.log('Deleted:', oldimgfilename, `from database`);
            });}
            await deletefile();
            listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing, image : {url : newurl, filename : newfilename } });
            // listing.image.filename = newfilename;
            // listing.image.url = newurl;            
            console.log(`Deleted ${oldimgfilename} from the databse and put ${newfilename} instead`)            
            console.log("");
        }}
        await update();
        console.log("Final new listing = ",listing);
        console.log(`Listing ${listing.title} has been editted and saved successfully`);
        req.flash("success", "Listing Editted Successfully");
        res.redirect(`/listing/show/${id}`);
    }catch(err){
        console.log(`Error in editting and saving the changes in the listing ${listing.title} : ${err}`)
        req.flash("error", " Failed to  Edit Listing");
        res.redirect(`/listing/show/${id}`);
    }
    
}

module.exports.deleteListing = async (req,res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this Listing");
        res.redirect(`/listing/show/${id}`);
        return;
    }
    let imgurl = listing.image.url;
    let imgfilename = listing.image.filename;

    cloudinary.uploader.destroy(`${imgfilename}`, function (error, result) {
        if (error) return console.error(error);
        console.log('Deleted:', imgfilename, `from database`);
    });


    await Listing.findByIdAndDelete(id)
    .then(console.log(`successfully deleted the listing \" ${listing.title} \" and all its reviews`))
    .catch((err) => {console.log(`error in deleting listing \" ${listing.title}\" : ${err}`)});   
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}



