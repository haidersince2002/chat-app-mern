import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, Search, X } from "lucide-react";
import SidebarSkeleton from "./Skeletons/SidebarSkeleton.jsx";

const Sidebar = ({ onUserSelect }) => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading, searchQuery, setSearchQuery } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => { getUsers(); }, [getUsers]);

  const filtered = (users || []).filter((u) => {
    if (showOnlineOnly && !onlineUsers.includes(u._id)) return false;
    if (searchQuery && !u.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const onlineCount = Math.max(0, (onlineUsers || []).length - 1);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="w-full h-full bg-card flex flex-col border-r border-border">
      {/* Header */}
      <div className="p-4 space-y-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Contacts</span>
          </div>
          {onlineCount > 0 && (
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {onlineCount} online
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-7 h-8 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Online filter */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="w-3 h-3 accent-primary"
          />
          <span className="text-xs text-muted-foreground">Online only</span>
        </label>
      </div>

      {/* User list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5 stagger">
          {filtered.map((user) => {
            const isOnline = onlineUsers?.includes(user._id);
            const isSelected = selectedUser?._id === user._id;

            return (
              <button
                key={user._id}
                onClick={() => { setSelectedUser(user); onUserSelect?.(); }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-150 text-left ${
                  isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent border border-transparent"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={user.profilePic || "/avatar.png"} alt={user.fullName} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {user.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 online-dot border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.fullName}</p>
                  <p className={`text-xs ${isOnline ? "text-emerald-500" : "text-muted-foreground"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-muted-foreground text-xs">
                {searchQuery ? "No matching contacts" : "No contacts yet"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
