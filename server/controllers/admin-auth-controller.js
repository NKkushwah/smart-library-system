const Admin = require("../models/admin-model");
const bcrypt = require("bcryptjs");

//  Home Route
const home = async (req, res) => {
    try {
        res.status(200).send("Welcome to admin Auth System 🚀");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

//  admin Register
const register = async (req, res) => {
    try {
        console.log(req.body);

        const { username, email, phone, password, role } = req.body;

        // check existing student
        const admintExist = await Admin.findOne({ email });

        if (admintExist) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // admincreate
        const adminCreated = await Admin.create({
            username,
            email,
            phone,
            password, // password ko model ke pre-save hook mein hash karenge
        });

        res.status(200).json({
            msg: "admin registered successfully",
            admin: adminCreated,
            token: await adminCreated.generateToken(),
            studentId: adminCreated._id.toString(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

// admin Login

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // role frontend se aa raha hai

    const admintExist = await Admin.findOne({ email });
    if (!admintExist) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await admintExist.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    //  Role validation
    if (role !== "admin" || admintExist.role !== "admin") {
      return res.status(403).json({ message: "Only students can login here" });
    }

    res.status(200).json({
      msg: "Login Successful ",
      token: await admintExist.generateToken(),
      studentId: admintExist._id.toString(),
      role: admintExist.role,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};





module.exports = { home, register, login };
