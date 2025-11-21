const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  // console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  // console.log(newReview);
  await newReview.save();
  await listing.save();

  // console.log("new review saved");
  // res.send("new review saved");
  req.flash("success", "New review created successfully");
  return res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  // Remove review reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review document itself
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", " Review deleted successfully");
  return res.redirect(`/listings/${id}`);
};
