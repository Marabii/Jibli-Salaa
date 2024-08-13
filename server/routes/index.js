const router = require("express").Router();

//--Routes--:

const users = require("./users");
const googleOAuth = require("./googleOAuth");
const traveler = require("./traveler");
const buyer = require("./buyer");

router.use(users);
router.use(googleOAuth);
router.use(traveler);
router.use(buyer);

module.exports = router;
