import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password, profilePic } = req.body;

    // Check for missing fields
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email }); // Added 'await'
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create user
    const userCreated = await User.create({
      fullName,
      email,
      password, // Make sure hashing is handled in the user model
      profilePic: profilePic,
    });

    // Generate token
    const token = await userCreated.generateToken();

    return res.status(201).json({
      message: "Signup successful",
      success: true,
      token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Empty function placeholders (you can implement them later)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(409).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res
        .status(409)
        .json({ message: "You don't have an account, Register before login" });
    }

    const isPassMatch = await userExist.comparePassword(password);

    if (!isPassMatch) {
      return res.status(409).json({ message: "Email or Password Invalid!" });
    }

    return res.status(200).json({
      message: "Login Successfull",
      user: userExist,
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // In a token-based authentication system,
    // logout is typically handled on the client-side by removing the token
    return res.status(200).json({
      message: "Logout Successful",
    });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, email } = req.body;
    const userId = req.userId;

    // Create an update object
    const updateFields = {};

    // Only add fields that are provided
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;

    // Only upload to cloudinary if a new profile pic is provided
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = uploadResponse.secure_url;
    }

    // Only update if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
