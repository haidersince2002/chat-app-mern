import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative z-40 lg:z-auto
          h-[calc(100vh-64px)] w-72
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shrink-0
        `}
      >
        <Sidebar onUserSelect={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        {/* Mobile menu button (when no chat open) */}
        {!selectedUser && (
          <Button
            onClick={() => setSidebarOpen(true)}
            variant="outline"
            size="icon"
            className="lg:hidden absolute top-3 left-3 z-20 rounded-full w-9 h-9"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}

        {selectedUser ? (
          <ChatContainer onMenuClick={() => setSidebarOpen(true)} />
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default HomePage;
