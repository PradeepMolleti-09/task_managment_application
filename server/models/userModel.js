import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    verifyOTP: { type: String, default: '' },
    verifyOTPExpiry: { type: Number, default: 0 },

    resetOTP: { type: String, default: '' },
    resetOTPExpiry: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },

    // 🔐 IDS (Brute-force detection)
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Number, default: 0 }

}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
