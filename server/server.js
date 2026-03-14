import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";
import taskRoutes from "./routes/taskRoutes.js";


const app = express();
const PORT = process.env.PORT || 9000;

// 🔍 Debug (remove later)
console.log("ENV CHECK:", {
    PORT,
    MONGO_URI: process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌"
});

const allowedOrigins = ['http://localhost:5173']

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Routes
app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/tasks", taskRoutes);


// Connect DB THEN start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("❌ Failed to start server:", err.message);
});
