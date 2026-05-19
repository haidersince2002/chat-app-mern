import { Router } from "express";
import protectRoute from "../middlewares/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.route("/users").get(protectRoute, getUsersForSidebar);
router.route("/:id").get(protectRoute, getMessages);
router.route("/send/:userId").post(protectRoute, sendMessage);
router.route("/read/:senderId").put(protectRoute, markMessagesAsRead);
router.route("/delete/:messageId").delete(protectRoute, deleteMessage);

export default router;
