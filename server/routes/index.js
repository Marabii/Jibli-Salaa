const router = require("express").Router();

//--Routes--:

const users = require("./users");
const googleOAuth = require("./googleOAuth");

router.use(users);
router.use(googleOAuth);

module.exports = router;
