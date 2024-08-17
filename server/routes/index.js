const router = require("express").Router();

//--Routes--:

const users = require("./users");
const googleOAuth = require("./googleOAuth");
const traveler = require("./traveler");
const buyer = require("./buyer");
const product = require("./product");

router.use(users);
router.use(googleOAuth);
router.use(traveler);
router.use(buyer);
router.use(product);

module.exports = router;
