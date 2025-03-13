import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signupUser } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signupUser(formData);
  };

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl rounded-lg p-8 w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-10">
            <div className="avatar mb-4">
              <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto">
                <img src="/logo.png" alt="ChatConnect Logo" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Sign Up</h1>
            <p className="text-base-content/70">Create your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">
                  Email Address
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text text-base-content">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/70 hover:text-base-content"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Create Account
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-base-content/70">
                Already have an account?{" "}
                <NavLink to="/login" className="link link-primary font-medium">
                  Log in
                </NavLink>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Chat App Preview */}
      <div className="hidden md:block md:w-1/2 bg-base-100">
        <div className="h-full p-8">
          <div className="card bg-base-200 rounded-lg shadow-lg overflow-hidden h-full">
            {/* Chat Header */}
            <div className="bg-base-300 p-4 flex items-center">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src="logo.png" alt="User" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-base-content font-medium">ChatConnect</h3>
                <p className="text-xs text-base-content/60">Online</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 flex-1 overflow-y-auto">
              {/* Received message */}
              <div className="chat chat-start mb-4">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full">
                    <img src="logo.png" alt="User" />
                  </div>
                </div>
                <div className="chat-bubble bg-base-300 text-base-content">
                  Welcome to ChatConnect!
                </div>
                <div className="chat-footer text-xs text-base-content/50">
                  10:42 AM
                </div>
              </div>

              {/* Sent message */}
              <div className="chat chat-end mb-4">
                <div className="chat-image avatar">
                  <div className="w-8 rounded-full">
                    <img src="logo.png" alt="User" />
                  </div>
                </div>
                <div className="chat-bubble bg-primary text-white">
                  Looks great!
                </div>
                <div className="chat-footer text-xs text-base-content/50">
                  10:45 AM
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-base-300 p-4 border-t border-base-content/10">
              <h3 className="text-base-content font-medium mb-3">Features:</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-base-content/70">
                  <svg
                    className="w-4 h-4 mr-2 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  End-to-end encryption
                </li>
                <li className="flex items-center text-base-content/70">
                  <svg
                    className="w-4 h-4 mr-2 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="..." clipRule="evenodd" />
                  </svg>
                  Real-time messaging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
