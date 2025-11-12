const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacherSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "teacher", // fixed role
      enum: ["teacher"],  // sirf student hi ho sakta hai
    },
     profileImage: {
      type: String, // image ka URL ya base64 string store hoga
      default: "",  // default empty, agar user upload nahi karta
    },
  },
  { timestamps: true }
);

// Password hash karne ke liye middleware
teacherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password compare method
teacherSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// JWT generate method
teacherSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
};

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
