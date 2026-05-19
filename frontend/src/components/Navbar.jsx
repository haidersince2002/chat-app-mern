import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { MessageCircle, Settings, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const { logoutUser, authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold hidden sm:block tracking-tight">
            Chat<span className="text-gradient">Connect</span>
          </span>
        </NavLink>

        {/* Nav actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark"
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>

          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/settings">
                {({ isActive }) => (
                  <Button variant={isActive ? "secondary" : "ghost"} size="icon" className="rounded-full">
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>

          {authUser && (
            <>
              <Separator orientation="vertical" className="h-5 mx-1" />

              {/* Profile */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/profile">
                    <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 p-0">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={authUser.profilePic || "/avatar.png"} alt={authUser.fullName} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {authUser.fullName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent>Profile</TooltipContent>
              </Tooltip>

              {/* Logout */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logoutUser}
                    className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Logout</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
