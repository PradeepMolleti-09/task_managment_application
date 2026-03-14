import User from "../models/userModel.js";

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            "-password -verifyOTP -verifyOTPExpiry -resetOTP -resetOTPExpiry"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user,
            isAccountVerified: user.isVerified
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export default getUserProfile;
