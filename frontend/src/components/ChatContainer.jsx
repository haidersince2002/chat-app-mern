// import { useEffect, useRef } from "react";
// import { useChatStore } from "../store/useChatStore";

// import MessageSkeleton from "../components/Skeletons/MessageSkeleton";
// import ChatHeader from "./ChatHeader";
// import MessageInput from "./MessageInput";
// import { useAuthStore } from "../store/useAuthStore";
// import { formatMessageTime } from "../lib/utils.js";

// const ChatContainer = () => {
//   const { messages, getMessages, isMessagesLoading, selectedUser } =
//     useChatStore();
//   const { authUser } = useAuthStore();
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         await getMessages(selectedUser._id);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       }
//     };
//     fetchMessages();
//   }, [selectedUser._id, getMessages]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (isMessagesLoading) {
//     return (
//       <div className="flex-1 flex flex-col overflow-auto">
//         <ChatHeader />
//         <MessageSkeleton />
//         <MessageInput />
//       </div>
//     );
//   }

//   // Get current user ID for determining message alignment
//   const currentUserId = localStorage.getItem("userId");

//   return (
//     <div className="flex-1 flex flex-col h-full">
//       <ChatHeader />

//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages && messages.length > 0 ? (
//           messages.map((message) => {
//             const isCurrentUser = message.senderId === authUser._id;
//             const profilePic = isCurrentUser
//               ? authUser.profilePic || "avatar.png"
//               : selectedUser?.profilePic || "avatar.png";

//             return (
//               <div
//                 key={message._id}
//                 className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
//               >
//                 {/* Profile Image */}
//                 <div className="chat-image avatar">
//                   <div className="size-10 rounded-full border overflow-hidden">
//                     <img
//                       src={profilePic}
//                       alt="Profile Picture"
//                       loading="lazy"
//                       onError={(e) => (e.target.src = "fallback-avatar.png")}
//                     />
//                   </div>
//                 </div>

//                 {/* Chat Header */}
//                 <div className="chat-header mb-1">
//                   <time className="text-xs opacity-50 ml-1">
//                     {formatMessageTime(message.createdAt)}
//                   </time>
//                 </div>

//                 {/* Chat Bubble */}
//                 <div className="chat-bubble flex flex-col">
//                   {message.image && (
//                     <img
//                       src={message.image}
//                       alt="Attachment"
//                       className="sm:max-w-[200px] rounded-md mb-2"
//                       loading="lazy"
//                       onError={(e) => (e.target.src = "fallback-image.png")}
//                     />
//                   )}
//                   {message.text && <p>{message.text}</p>}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           // No Messages Placeholder
//           <div className="flex items-center justify-center h-full">
//             <p className="text-gray-500">
//               No messages yet. Start the conversation!
//             </p>
//           </div>
//         )}

//         {/* Scroll Anchor */}
//         <div ref={messagesEndRef} />
//       </div>

//       <MessageInput />
//     </div>
//   );
// };

// export default ChatContainer;

import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageSkeleton from "../components/Skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
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
  }, [selectedUser._id, getMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
