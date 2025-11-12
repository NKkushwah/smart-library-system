const { z } = require("zod");

const userSchema = z.object({
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address")
    .min(3, { message: "Email must be at least 3 characters" })
    .max(255, { message: "Email must not exceed 255 characters" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must not exceed 100 characters" }),
});

module.exports = userSchema;
