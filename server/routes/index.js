const router = require("express").Router();

//--Routes--:

const users = require("./users");

router.use(users);

module.exports = router;
