import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "../components/Skeletons/SidebarSkeleton.jsx";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="w-72 bg-base-100 border-r border-base-300 h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-base-100 p-4 border-b border-base-300 space-y-4">
        {/* Title Section */}
        <div className="flex items-center gap-2 text-primary">
          <Users size={20} />
          <h2 className="text-lg font-semibold">Contacts</h2>
        </div>

        {/* Filter Section */}
        <div className="form-control">
          <label className="label cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="label-text text-sm">Show Online Only</span>
          </label>
          <div className="text-xs text-base-content/70 ml-6">
            ({onlineUsers.length - 1} Online)
          </div>
        </div>
      </div>

      {/* User List */}
      <ul className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-14rem)]">
        {filteredUsers?.map((user) => (
          <li
            key={user._id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
              selectedUser?._id === user._id
                ? "bg-primary text-white"
                : "hover:bg-base-200"
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {/* Profile Picture */}
            <div className="relative">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={user.profilePic || "/images/avatar.png"}
                    alt={`${user.fullName}'s profile`}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              {(onlineUsers || []).includes(user._id) && (
                <span className="badge badge-success badge-xs absolute bottom-0 right-0 border-2 border-base-100" />
              )}
            </div>

            {/* User Details */}
            <div className="ml-4 overflow-hidden flex-1">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="flex items-center space-x-1 text-xs text-base-content/70">
                {(onlineUsers || []).includes(user._id) && (
                  <span className="w-2 h-2 bg-success rounded-full" />
                )}
                <span className="truncate">
                  {(onlineUsers || []).includes(user._id)
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          </li>
        ))}

        {filteredUsers?.length === 0 && (
          <div className="text-center text-base-content/50 p-4">
            No contacts available
          </div>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
