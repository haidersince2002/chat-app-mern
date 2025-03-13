import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, Token not provided" });
    }

    // console.log("token from auth middleware: ", token);
    const jwtToken = token.replace("Bearer", "").trim();
    // console.log("token from auth middleware: ", jwtToken);

    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    // console.log(decode);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const userData = await User.findOne({ email: decode.email }).select({
      password: 0,
    });
    // console.log(userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = userData;
    req.token = token;
    req.userId = userData._id;
    // console.log("User ID from token:", req.userId);
    // console.log("Authenticated User:", req.user);

    next();
  } catch (error) {
    console.log("Error in protextRoute middleware: ", error.message);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default protectRoute;
