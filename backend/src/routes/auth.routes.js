import { Router } from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { loginSchema, signupSchema } from "../validator/zodValidate.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(validate(signupSchema), signup);
router.route("/login").post(validate(loginSchema), login);
router.route("/logout").post(logout);

router.route("/update-profile").put(protectRoute, updateProfile);
router.route("/check").get(protectRoute, checkAuth);

export default router;
