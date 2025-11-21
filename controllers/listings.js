const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
   const { q } = req.query; // search term
  let allListings;

  if (q && q.trim() !== "") {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
      ],
    });

    if (allListings.length === 0) {
      req.flash("error", `No listings found for "${q}".`);
      return res.redirect("/listings");
    }
    return res.render("listings/index", { allListings, searchQuery: q });
  }
  allListings = await Listing.find({});
  
  return res.render("listings/index", { allListings, searchQuery: "" });
};

module.exports.renderNewForm = (req, res) => {
  return res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  // console.log(req.user);
  return res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  async function locateCity(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      cityName
    )}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "MyLeafletApp/1.0 (example@gmail.com)" },
    });
    const data = await response.json();

    if (data.length === 0) {
      console.log("City not found!");
      return null;
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    console.log("Latitude:", lat, "Longitude:", lon);
    return { lat, lon };
  }

  const coordinates = await locateCity(req.body.listing.location);

  if (!coordinates) {
    // if no coordinates found, stop and return error or handle gracefully
    req.flash("error", "City not found or coordinates unavailable.");
    return res.redirect("/listings/new");
  }
  

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = {
    type: "Point",
    coordinates: [coordinates.lon, coordinates.lat], // ⚠️ GeoJSON = [longitude, latitude]
  };
  await newListing.save();
  console.log(newListing);
  req.flash("success", "New listing created successfully");
  return res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  return res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully");
  return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  return res.redirect("/listings");
};
