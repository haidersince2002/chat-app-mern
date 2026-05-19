import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import xss from "xss";

const xssOptions = { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ["script", "style"] };
const sanitize = (str) => (str ? xss(str.trim(), xssOptions) : str);

export const signup = async (req, res) => {
  try {
    const { email, fullName, password, profilePic } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Sanitize user-controlled text fields
    const cleanName = sanitize(fullName);
    const cleanEmail = sanitize(email).toLowerCase();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExist = await User.findOne({ email: cleanEmail });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const userCreated = await User.create({
      fullName: cleanName,
      email: cleanEmail,
      password,
      profilePic: profilePic || "",
    });

    const token = await userCreated.generateToken();

    const userData = {
      _id: userCreated._id,
      fullName: userCreated.fullName,
      email: userCreated.email,
      profilePic: userCreated.profilePic,
      createdAt: userCreated.createdAt,
    };

    return res.status(201).json({ message: "Signup successful", success: true, token, userData });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = sanitize(email).toLowerCase();

    const userExist = await User.findOne({ email: cleanEmail });
    if (!userExist) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPassMatch = await userExist.comparePassword(password);
    if (!isPassMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await userExist.generateToken();

    const userData = {
      _id: userExist._id,
      fullName: userExist.fullName,
      email: userExist.email,
      profilePic: userExist.profilePic,
      createdAt: userExist.createdAt,
    };

    return res.status(200).json({ message: "Login Successful", userData, token });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, email } = req.body;
    const userId = req.userId;

    const updateFields = {};

    if (fullName) updateFields.fullName = sanitize(fullName);
    if (email) {
      const cleanEmail = sanitize(email).toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      updateFields.email = cleanEmail;
    }

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = uploadResponse.secure_url;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
