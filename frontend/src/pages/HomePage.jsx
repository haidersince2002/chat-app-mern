import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex flex-1 bg-base-200">
      {/* Sticky Sidebar */}
      <div className="sticky top-0 h-full w-72">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="card bg-base-100 shadow-xl rounded-lg m-4 flex-1">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
