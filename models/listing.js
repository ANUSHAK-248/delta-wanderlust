const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultimage = "https://images.unsplash.com/photo-1687847631776-6f1af4b626fb?q=80&w=1384&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Review = require("./review.js");

const listingSchema = new Schema ({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {        
        // type : String,
        // default : defaultimage,
        url : {
            type : String,
            set : (v) => v === "" ? defaultimage : v ,        
            default : defaultimage,
        },
        filename : String,        
    } ,
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type : Schema.Types.ObjectId,
        ref: "User",
    },
    
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;