if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reveiw.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;
// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  ttl: 7 * 24 * 60 * 60 
});

store.on("error",(err)=>{
  console.log("erorr in mongo session store",err);
})
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() +  7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy
passport.serializeUser(User.serializeUser());// use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    // console.log(res.locals.successMsg)
    res.locals.currUser = req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
  let fakeUser = new User({
    email:"student@gamil.com",
    username:"mbm-student",
  });

  let registeredUser = await User.register(fakeUser,"mypassword");
  res.send(registeredUser);
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  console.log(" ERROR LOCATION:", err);   

  if (res.headersSent) {
    return next(err);   
  }

  let { statusCode = 500 } = err;
  return res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080, (req, res) => {
  console.log("server is listening on port 8080 ");
});
