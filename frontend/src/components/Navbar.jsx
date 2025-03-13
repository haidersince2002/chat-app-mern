import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";

const Navbar = () => {
  const { logoutUser, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Branding */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="/logo.png" alt="ChatConnect" className="object-cover" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-primary hidden md:block">
            ChatConnect
          </h1>
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `btn btn-ghost btn-sm ${
                isActive ? "btn-primary" : "text-base-content/70"
              }`
            }
          >
            Settings
          </NavLink>

          {authUser && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `btn btn-ghost btn-sm ${
                    isActive ? "btn-primary" : "text-base-content/70"
                  }`
                }
              >
                Profile
              </NavLink>
              <button
                onClick={logoutUser}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
