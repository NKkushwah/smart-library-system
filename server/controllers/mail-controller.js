const { sendCredentialsMail } = require("../utils/mailer");

exports.sendMailToTeacher = async (req, res) => {
  try {
    const { teacherEmail, studentId, tempPassword } = req.body;

    if (!teacherEmail || !studentId || !tempPassword) {
      return res.status(400).json({ error: "All fields required" });
    }

    await sendCredentialsMail(teacherEmail, studentId, tempPassword);

    res.json({ success: true, message: "Mail sent successfully!" });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, error: "Failed to send mail" });
  }
};
