const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send credentials
exports.sendCredentialsMail = async (teacherEmail, studentId, tempPassword) => {
  const mailOptions = {
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to: teacherEmail,
    subject: "tracher Credentials",
    text: `Hello Teacher,

Here are the teacher login credentials:

Teacher ID: ${studentId}
Password: ${tempPassword}

⚠️ Please ask the teacher to change this password after first login.

Regards,
Admin`,
  };

  return transporter.sendMail(mailOptions);
};
