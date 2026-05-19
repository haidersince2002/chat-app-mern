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

    const jwtToken = token.replace("Bearer", "").trim();

    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const userData = await User.findOne({ email: decode.email }).select({
      password: 0,
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = userData;
    req.token = token;
    req.userId = userData._id;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

export default protectRoute;
