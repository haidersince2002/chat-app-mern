import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Password hashing with bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(this.password, saltRound);
    this.password = hash_password;
    next();
  } catch (error) {
    next(error);
  }
});

// Comparing new password with the previous one with bcrypt
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// JSON Web Token generation
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
  } catch (error) {
    console.error("error", error);
    throw error; // It's better to rethrow the error
  }
};

const User = model("User", userSchema);

export default User;
