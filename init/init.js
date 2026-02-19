if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("../models/listing"); // check path
const { data: sampleListings } = require("./data"); // check path

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(sampleListings);
  console.log("Database Initialized");
};

main()
  .then(() => initDB())
  .then(() => {
    console.log("Done");
    mongoose.connection.close();
  })
  .catch(err => console.log(err));