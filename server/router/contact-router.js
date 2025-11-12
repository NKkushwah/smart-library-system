const express = require("express");
const router = express.Router();
const contactform = require("../controllers/contact-controllers");

router.route("/contact").post(contactform);

module.exports = router;