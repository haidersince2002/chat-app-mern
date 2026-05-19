import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatContainer = ({ onMenuClick }) => {
  const {
    messages, getMessages, isMessagesLoading,
    selectedUser, subscribeToMessages, unsubscribeFromMessages,
    typingUsers, deleteMessage, markAsRead,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    markAsRead(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [contextMenu]);

  const handleRightClick = (e, message) => {
    e.preventDefault();
    if (message.senderId === authUser._id) {
      setContextMenu({ x: e.clientX, y: e.clientY, messageId: message._id });
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col bg-background overflow-hidden">
        <ChatHeader onMenuClick={onMenuClick} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const isTyping = typingUsers[selectedUser?._id];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background overflow-hidden relative">
      <ChatHeader onMenuClick={onMenuClick} />

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 bg-grid">
        <div className="p-4 space-y-3">
          {messages?.length > 0 ? messages.map((msg, i) => {
            const isMine = msg.senderId === authUser._id;
            const pic = isMine ? authUser.profilePic : selectedUser?.profilePic;

            return (
              <div
                key={msg._id}
                className={`flex items-end gap-2 animate-fade-in ${isMine ? "justify-end" : "justify-start"}`}
                onContextMenu={(e) => handleRightClick(e, msg)}
                style={{ animationDelay: `${Math.min(i * 0.03, 0.25)}s` }}
              >
                {!isMine && (
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={pic || "/avatar.png"} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {selectedUser?.fullName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[68%] group relative`}>
                  {/* Bubble */}
                  <div className={`px-3.5 py-2.5 text-sm leading-relaxed ${isMine ? "bubble-sent" : "bubble-received"}`}>
                    {msg.image && (
                      <img src={msg.image} alt="Attachment" className="rounded-lg mb-2 max-w-full" />
                    )}
                    {msg.text && <span>{msg.text}</span>}
                  </div>

                  {/* Timestamp + receipt */}
                  <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMine ? "justify-end" : "justify-start"}`}>
                    <span className="text-[10px] text-muted-foreground">{formatMessageTime(msg.createdAt)}</span>
                    {isMine && (
                      msg.status === "read"
                        ? <CheckCheck className="w-3.5 h-3.5 text-primary" />
                        : msg.status === "delivered"
                        ? <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
                        : <Check className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Delete on hover */}
                  {isMine && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {isMine && (
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={pic || "/avatar.png"} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {authUser?.fullName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          }) : (
            <div className="h-full flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-muted-foreground text-sm">No messages yet — say hello!</p>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2 animate-fade-in">
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarImage src={selectedUser?.profilePic || "/avatar.png"} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {selectedUser?.fullName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="bubble-received px-3.5 py-3 flex items-center gap-1">
                <span className="typing-dot text-primary" />
                <span className="typing-dot text-primary" />
                <span className="typing-dot text-primary" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <MessageInput />

      {/* Context menu */}
      {contextMenu && (
        <div
          className="context-menu fixed z-50 py-1.5 px-1 min-w-[140px]"
          style={{
            top: Math.min(contextMenu.y, window.innerHeight - 70),
            left: Math.min(contextMenu.x, window.innerWidth - 160),
          }}
        >
          <button
            onClick={() => { deleteMessage(contextMenu.messageId); setContextMenu(null); }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete message
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
