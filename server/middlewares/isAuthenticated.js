const passport = require("passport");

const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, user: null, message: "Unauthorized" });
    }
    req.user = user;
    return res.status(200).json({ success: true, user });
  })(req, res, next);
};

module.exports = isAuthenticated;
