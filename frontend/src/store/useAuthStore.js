import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  // State
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  onlineUsers: [],
  socekt: null,

  // Store token & configure axios
  storeTokenInLS: (serverToken) => {
    if (!serverToken) return;

    localStorage.setItem("token", serverToken);

    // Set token in axios headers - ensure this is actually happening
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${serverToken}`;
    // console.log(
    //   "Set token in headers:",
    //   axiosInstance.defaults.headers.common["Authorization"]
    // );

    set({ token: serverToken, isLoggedIn: true });
  },

  // Check authentication
  checkAuth: async () => {
    const { token } = get();
    if (!token) return set({ isCheckingAuth: false, authUser: null });

    try {
      const res = await axiosInstance.get("api/auth/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Logout user
  logoutUser: () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];

    set({ token: null, authUser: null, isLoggedIn: false });
    toast.success("Logged out successfully");
    get().disconnectSocket();
  },

  // Initialize authentication on app load
  initializeAuth: () => {
    const { token } = get();
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      get().checkAuth();
    }
  },

  // Signup user
  signupUser: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/api/auth/signup", data);
      get().storeTokenInLS(response.data.token);

      set({ authUser: response.data.userData });
      toast.success("Account Created Successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login user
  loginUser: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      get().storeTokenInLS(res.data.token);

      set({ authUser: res.data.userData });
      toast.success("Logged in Successfully");
      await get().checkAuth();

      get().connectSocket();
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // Get the current token and explicitly set it in headers for this request
      const { token } = get();
      // console.log("Token before request:", token);

      const res = await axiosInstance.put("/api/auth/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ authUser: res.data.updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.connect();

    set({ socket: socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
