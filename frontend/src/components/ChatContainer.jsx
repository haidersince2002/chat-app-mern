import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "../components/Skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await getMessages(selectedUser._id);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100">
      <ChatHeader className="sticky top-0 z-20" />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages && messages.length > 0 ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === authUser._id;
            const profilePic = isCurrentUser
              ? authUser.profilePic || "/avatar.png"
              : selectedUser?.profilePic || "/avatar.png";

            return (
              <div
                key={message._id}
                className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
                ref={messagesEndRef}
              >
                {/* Profile Image */}
                <div className="chat-image avatar">
                  <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="rounded-full object-cover"
                      onError={(e) => (e.target.src = "/avatar.png")}
                    />
                  </div>
                </div>

                {/* Message Content */}
                <div className="chat-bubble bg-base-200 text-base-content p-4 rounded-lg">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-md mb-2 max-w-xs object-cover"
                      onError={(e) => (e.target.src = "/avatar.png")}
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>

                {/* Message Metadata */}
                <div className="chat-footer text-xs text-base-content/70 mt-1">
                  {formatMessageTime(message.createdAt)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-base-content/50">
              No messages yet. Start your conversation now!
            </p>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 z-20">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
