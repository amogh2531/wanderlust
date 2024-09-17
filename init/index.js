const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")




let mongo_url = 'mongodb://127.0.0.1:27017/wonderlust'

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

const initDB= async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"661e66e535d555d02e2bfb5c"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();