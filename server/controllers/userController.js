import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser)
            return res.json({success: false, message: 'User already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Login User : /api/user/login
// Disabled for OAuth migration
export const login = (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Email/password login is disabled. Please use Google login."
  });
}


// Check Auth : /api/user/is-auth
export const isAuth = async (req, res)=>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout User : /api/user/logout

export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}



export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phone,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};