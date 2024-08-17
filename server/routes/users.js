const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");
const cookie = require("cookie");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Validate an existing user and issue a JWT
router.post("/api/login", (req, res, next) => {
  console.log("Login API called");
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ success: false, msg: "Could not find user" });
      }

      if (user.isAuthenticatedByGoogle) {
        return res
          .status(404)
          .json({ success: false, msg: "Please use Google login" });
      }

      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);

        // Set the JWT as an HttpOnly cookie
        res.setHeader("Set-Cookie", [
          cookie.serialize("jwtToken", tokenObject.token, {
            httpOnly: true, // Ensures the cookie is only accessible via HTTP(S), not JavaScript
            secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS
            maxAge: 3600 * 2,
            path: "/", // Root path, so the cookie is available site-wide
          }),
          cookie.serialize("tokenExpiration", tokenObject.expires, {
            httpOnly: true, // Optional: could be set to false if you need to access it via JavaScript
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600 * 2,
            path: "/",
          }),
        ]);

        return res.status(200).json({ success: true });
      } else {
        return res
          .status(401)
          .json({ success: false, msg: "You entered the wrong password" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Register a new user
router.post("/api/register", async (req, res, next) => {
  try {
    const saltHash = utils.genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      hash: hash,
      salt: salt,
    });

    newUser.save().then(() => {
      res.json({ success: true });
    });
  } catch (err) {
    res.json({ success: false, msg: err });
  }
});

router.get("/api/getUser", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.find(
      { _id: userId },
      {
        verificationDetails: 1,
        profilePicture: 1,
        isVerified: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
      }
    );
    return res.status(200).json({ success: true, userInfo: user });
  } catch (err) {
    console.error("Error getting user:", err.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get("/api/getUser/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.find(
      { _id: userId },
      {
        verificationDetails: 1,
        profilePicture: 1,
        isVerified: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
      }
    );
    return res.status(200).json({ success: true, userInfo: user });
  } catch (err) {
    console.error("Error getting user:", err.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.get("/api/verifyUser", isAuthenticated, (req, res) => {
  return res.json({ success: true, user: req.user });
});

module.exports = router;
