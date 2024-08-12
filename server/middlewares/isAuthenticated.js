const passport = require("passport");

const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, user: user, message: "Unauthorized" });
    }
    // If authentication is successful, proceed to the next middleware or route handler
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = isAuthenticated;
