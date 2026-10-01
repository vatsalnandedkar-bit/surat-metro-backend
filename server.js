const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ================= MONGODB =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed:");
    console.log(error.message);
  });

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.json({
    message: "Surat Metro Backend API is Running",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});