import { create } from "zustand";
import { axiosInstance, setUnauthorizedHandler } from "../lib/axios.js";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

// ─── Token helpers ────────────────────────────────────────────────────────────
// Single source of truth: token lives in localStorage and is always injected
// into the axios default Authorization header. No component/store ever reads
// localStorage directly or passes headers manually.

const TOKEN_KEY = "cc_token";

const readToken = () => localStorage.getItem(TOKEN_KEY);

const applyToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Apply stored token immediately on module load so any request made before
// checkAuth() resolves is already authenticated.
applyToken(readToken());

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ── Auth check on page load ───────────────────────────────────────────────
  checkAuth: async () => {
    if (!readToken()) return set({ isCheckingAuth: false, authUser: null });

    try {
      const res = await axiosInstance.get("/api/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch {
      applyToken(null);                      // clear invalid token
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ── Signup ────────────────────────────────────────────────────────────────
  signupUser: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/auth/signup", data);
      applyToken(res.data.token);
      set({ authUser: res.data.userData });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ── Login ─────────────────────────────────────────────────────────────────
  loginUser: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      applyToken(res.data.token);
      set({ authUser: res.data.userData });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logoutUser: () => {
    applyToken(null);
    set({ authUser: null });
    get().disconnectSocket();
    toast.success("Logged out successfully");
  },

  // ── Update Profile ────────────────────────────────────────────────────────
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/api/auth/update-profile", data);
      set({ authUser: res.data.updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ── Socket ────────────────────────────────────────────────────────────────
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
  },


  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));

// Wire up auto-logout on 401 (token expired / invalid)
setUnauthorizedHandler(() => {
  const state = useAuthStore.getState();
  if (state.authUser) state.logoutUser();
});
