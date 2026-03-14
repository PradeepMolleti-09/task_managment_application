import express from "express";
import getUserProfile from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.get("/data", userAuth, getUserProfile);

export default router;
