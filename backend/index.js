import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT ; // Default to 5000 if PORT is missing

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

// Middlewares
app.use(express.json()); // Parse JSON request body
app.use(cookieParser()); // Handle cookies

// Importing Routes
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";

// Using API Routes
app.use("/api/user", userRoutes);
app.use("/api/pins", pinRoutes); // Ensure this matches frontend API calls

// Resolve __dirname for ES modules
const __dirname = path.resolve();

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start Server only after Database is connected
// connectDb()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`🚀 Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1);
//   });


// previous code which starts db after starting server 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
