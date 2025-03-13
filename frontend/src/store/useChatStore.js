import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: null,
  users: null,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    const token = localStorage.getItem("token"); // Check token before request
    // console.log("Auth Token:", token); // Debugging

    try {
      const res = await axiosInstance.get("api/messages/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Unauthorized");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    const token = localStorage.getItem("token"); // Check token before request
    // console.log("Auth Token:", token); // Debugging
    try {
      const res = await axiosInstance.get(`api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    const token = localStorage.getItem("token"); // Check token before request
    // console.log("Auth Token:", token); // Debugging

    if (!selectedUser || !selectedUser._id) {
      toast.error("No user selected!");
      return;
    }

    const completeMessageData = {
      ...messageData,
      senderId: localStorage.getItem("userId"), // Ensure senderId is included
      receiverId: selectedUser._id, // Ensure receiverId is included
    };

    try {
      const res = await axiosInstance.post(
        `/api/messages/send/${selectedUser._id}`,
        completeMessageData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      console.log("Error in sendMessage store: ", error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // //todo: optimize this one later
    // socket.on("newMessage", (newMessage) => {
    //   set({
    //     messages: [...get().messages, newMessage],
    //   });
    // });

    //optimized one
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId !== selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
