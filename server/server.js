import dotenv from "dotenv";
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

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

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL // Allow Vercel URL from env
].filter(Boolean);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
