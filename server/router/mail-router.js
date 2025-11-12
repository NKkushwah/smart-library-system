const express = require("express");
const router = express.Router();
const { sendMailToTeacher } = require("../controllers/mail-controller");

router.post("/send-mail", sendMailToTeacher);

module.exports = router;
