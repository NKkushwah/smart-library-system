require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error_middleware");

const path = require("path");
const studyMaterialRoutes = require("./router/studyMaterialRoutes");


const app = express();

// ✅ CORS settings
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // image base64 ke liye limit
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/auth", require("./router/auth-router"));
app.use("/api/form", require("./router/contact-router"));
app.use("/api/student", require("./router/student-auth-route")); // student routes
app.use("/api/admin", require("./router/admin-auth-route"));
app.use("/api/teacher", require("./router/teacher-auth-route"));
app.use("/api/mail", require("./router/mail-router"));
app.use("/api/books", require("./router/books"));
app.use("/api/issuebooks", require("./router/issueBooks"));
app.use("/api/notifications", require("./router/notifications"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/study-material", studyMaterialRoutes);

// ✅ Error middleware
app.use(errorMiddleware);

// ✅ Connect DB & start server
const PORT = process.env.PORT || 5000;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
