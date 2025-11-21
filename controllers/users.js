const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  return res.render("users/signup.ejs");
};

module.exports.showSignupForm = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wanderlust");
      return res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  return res.render("users/login.ejs");
};

module.exports.showLoginForm = async (req, res) => {
  req.flash("success", "welcome back to wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    return res.redirect("/listings");
  });
}