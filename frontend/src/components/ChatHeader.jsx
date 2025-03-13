import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="sticky top-0 bg-base-100 z-20 p-4 border-b border-base-300">
      <div className="bg-base-100 p-4 border-b border-base-300 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* Avatar with online indicator */}
            <div className="avatar relative">
              <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt={`${selectedUser?.fullName}'s profile`}
                  className="rounded-full object-cover"
                />
              </div>
              {(onlineUsers || []).includes(selectedUser?._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100" />
              )}
            </div>

            <div>
              <h3 className="text-base-content font-medium">
                {selectedUser?.fullName}
              </h3>
              <div className="flex items-center text-xs text-base-content/70">
                {(onlineUsers || []).includes(selectedUser?._id) && (
                  <span className="w-2 h-2 bg-success rounded-full mr-1" />
                )}
                <span>
                  {(onlineUsers || []).includes(selectedUser?._id)
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="btn btn-circle btn-sm bg-base-300 hover:bg-base-200 border-0"
          >
            <X className="size-5 text-base-content/70" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
