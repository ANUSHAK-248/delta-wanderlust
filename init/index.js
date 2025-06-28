const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js")

const mongo_offline_url = 'mongodb://127.0.0.1:27017/wanderlust';

async function main(){
    await mongoose.connect(mongo_offline_url);
}

main()
    .then(() => {
        console.log("successfully connected to mongo DB");
    })
    .catch(err => {
        console.log("error in connecting to mongo DB ",err);
    })

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner:"685e05baa413ac6ca57d119c"}))
    await Listing.insertMany(initdata.data);
    console.log("whole data was erased and new is initialised in wanderlust database");
}
initDB();