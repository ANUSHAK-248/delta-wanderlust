class ExpressError extends Error {
    constructor(status, message){
        super(status, message);
        this.status = status;
        this.message = message;
    }
}

module.exports= ExpressError;


// if(!listing.title){
//         throw new ExpressError(400, "title is missing");
//     }
//     if(!listing.description){
//         throw new ExpressError(400, "Description is missing");
//     }
//     if(!listing.price){
//         throw new ExpressError(400, "price is missing");
//     }
//     if(!listing.location){
//         throw new ExpressError(400, "location is missing");
//     }
//     if(!listing.country){
//         throw new ExpressError(400, "country is missing");
//     }