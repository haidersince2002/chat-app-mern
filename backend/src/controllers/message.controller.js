import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import xss from "xss";

// Strict XSS options: strip all HTML tags and attributes
const xssOptions = {
  whiteList: {},         // no tags allowed
  stripIgnoreTag: true,  // strip any tag not in whitelist
  stripIgnoreTagBody: ["script", "style"],
};

const sanitize = (str) => (str ? xss(str.trim(), xssOptions) : str);

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.userId;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedFor: { $ne: myId },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.userId;
    const senderId = req.userId;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: "Sender and receiver IDs are required" });
    }

    // Validate: must have text or image
    if (!text?.trim() && !image) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Sanitize text — strip all HTML/scripts
    const sanitizedText = sanitize(text);

    // Length guard: prevent huge payloads stored in DB
    if (sanitizedText && sanitizedText.length > 2000) {
      return res.status(400).json({ message: "Message too long (max 2000 characters)" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: sanitizedText || "",
      image: imageUrl,
      status: "sent",
    });

    await newMessage.save();

    // If receiver is online, mark as delivered and notify
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      newMessage.status = "delivered";
      await newMessage.save();
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const myId = req.userId;

    const result = await Message.updateMany(
      { senderId, receiverId: myId, status: { $ne: "read" } },
      { status: "read" }
    );

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { readBy: myId, senderId });
    }

    res.status(200).json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Error in markMessagesAsRead controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const myId = req.userId;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.senderId.toString() === myId.toString()) {
      // Sender deletes for everyone
      await Message.findByIdAndDelete(messageId);
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", { messageId });
      }
      return res.status(200).json({ message: "Message deleted for everyone" });
    } else {
      // Receiver hides it only for themselves
      await Message.findByIdAndUpdate(messageId, { $addToSet: { deletedFor: myId } });
      return res.status(200).json({ message: "Message deleted for you" });
    }
  } catch (error) {
    console.error("Error in deleteMessage controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
