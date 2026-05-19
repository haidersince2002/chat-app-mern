import { X, Menu } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ChatHeader = ({ onMenuClick }) => {
  const { selectedUser, setSelectedUser, typingUsers } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers?.includes(selectedUser?._id);
  const isTyping = typingUsers[selectedUser?._id];

  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-border bg-card shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden -ml-2 rounded-full w-8 h-8">
          <Menu className="w-4 h-4" />
        </Button>

        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-9 h-9">
            <AvatarImage src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.fullName} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {selectedUser?.fullName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && <span className="absolute bottom-0 right-0 online-dot border-card" />}
        </div>

        {/* Name + status */}
        <div>
          <p className="font-semibold text-sm leading-tight">{selectedUser?.fullName}</p>
          <div className="text-xs">
            {isTyping ? (
              <span className="text-primary flex items-center gap-1">
                typing
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </span>
            ) : isOnline ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Online
              </span>
            ) : (
              <span className="text-muted-foreground">Offline</span>
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSelectedUser(null)}
        className="rounded-full w-8 h-8 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
