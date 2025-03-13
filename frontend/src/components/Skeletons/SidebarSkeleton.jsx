import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="w-72 bg-base-100 border-r border-base-300 h-full animate-pulse">
      {/* Header */}
      <div className="sticky top-0 bg-base-100 p-4 border-b border-base-300">
        <div className="flex items-center gap-2 text-primary">
          <Users size={20} />
          <h2 className="text-lg font-semibold">Contacts</h2>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="p-4 space-y-4">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-2 rounded-lg bg-base-200"
          >
            {/* Avatar Skeleton */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-base-300" />
            </div>

            {/* User Info Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-base-300 rounded" />
              <div className="h-3 w-24 bg-base-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
