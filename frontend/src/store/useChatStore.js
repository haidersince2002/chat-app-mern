import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore.js";

// Notification sound
const notificationSound = new Audio("/notification.mp3");
notificationSound.volume = 0.3;

export const useChatStore = create((set, get) => ({
  messages: null,
  users: null,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: {},   // { [userId]: true }
  searchQuery: "",

  setSearchQuery: (query) => set({ searchQuery: query }),

  // ── Users ──────────────────────────────────────────────────────────────────
  // No manual headers — axiosInstance already has Authorization from useAuthStore
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/api/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ── Messages ───────────────────────────────────────────────────────────────
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error in getMessages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) { toast.error("No user selected!"); return; }

    try {
      const res = await axiosInstance.post(`/api/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...(messages || []), res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      console.error("Error in sendMessage:", error);
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/api/messages/delete/${messageId}`);
      set({ messages: get().messages?.filter((m) => m._id !== messageId) || [] });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
      console.error("Error in deleteMessage:", error);
    }
  },

  markAsRead: async (senderId) => {
    try {
      await axiosInstance.put(`/api/messages/read/${senderId}`, {});
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },

  // ── Real-time ──────────────────────────────────────────────────────────────
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        set({ messages: [...(get().messages || []), newMessage] });
        get().markAsRead(selectedUser._id);
      }
      // Notification sound for incoming messages
      try { notificationSound.currentTime = 0; notificationSound.play().catch(() => {}); } catch {}
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set({ messages: get().messages?.filter((m) => m._id !== messageId) || [] });
    });

    socket.on("messagesRead", ({ readBy }) => {
      const updated = get().messages?.map((m) =>
        m.receiverId === readBy && m.status !== "read" ? { ...m, status: "read" } : m
      );
      if (updated) set({ messages: updated });
    });

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        set({ typingUsers: { ...get().typingUsers, [senderId]: true } });
      }
    });

    socket.on("userStopTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) {
        const updated = { ...get().typingUsers };
        delete updated[senderId];
        set({ typingUsers: updated });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messagesRead");
    socket.off("userTyping");
    socket.off("userStopTyping");
  },

  emitTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.emit("typing", { receiverId });
  },

  emitStopTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.emit("stopTyping", { receiverId });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, messages: null, typingUsers: {} }),
}));
