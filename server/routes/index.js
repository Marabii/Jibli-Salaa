const router = require("express").Router();

//--Routes--:

const users = require("./users");
const googleOAuth = require("./googleOAuth");
const traveler = require("./traveler");

router.use(users);
router.use(googleOAuth);
router.use(traveler);

module.exports = router;
