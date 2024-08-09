const passport = require("passport");
const router = require("express").Router();
const url = require("url");

console.log(process.env.GoogleOAuth_CLient_ID);
console.log(process.env.GoogleOAuth_CLient_Secret);

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GoogleOAuth_CLient_ID,
      clientSecret: process.env.GoogleOAuth_CLient_Secret,
      callbackURL: "http://localhost:3001/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

//----Handling routes----//

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const tokenObject = utils.issueJWT(req.user);
    res.redirect(
      `${process.env.FRONT_END}/?token=${tokenObject.token}&expiresIn=${tokenObject.expires}&fromGoogle=true`
    );
  }
);

router.get("/oauth2callback", async (req, res) => {
  let q = url.parse(req.url, true).query;

  if (q.error) {
    // An error response e.g. error=access_denied
    console.log("Error:" + q.error);
  } else if (q.state !== req.session.state) {
    //check state value
    console.log("State mismatch. Possible CSRF attack");
    res.end("State mismatch. Possible CSRF attack");
  } else {
    // Get access and refresh tokens (if access_type is offline)

    let { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);
  }

  res.end("Authentication successful. Please return to the console.");
});

//----Finish Hanlding routes----//

module.exports = router;
