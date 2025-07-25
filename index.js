const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const teamRoutes = require("./routes/teams");

dotenv.config();

const app = express();

// ✅ Proper CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://tasktrackr-frontend.netlify.app", // ← replace with actual Netlify URL
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("TaskTrackr API running 🚀");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/teams", teamRoutes); // ✅ now using the imported variable

// MongoDB + Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("🚀 Server running on port 5000")
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
