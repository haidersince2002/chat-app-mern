const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-base-100 animate-pulse">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
        >
          {/* Avatar Skeleton */}
          <div className="chat-image avatar">
            <div className="w-10 h-10 rounded-full bg-base-300" />
          </div>

          {/* Message Content Skeleton */}
          <div className="chat-bubble bg-base-200 p-4 rounded-lg space-y-2">
            <div className="h-4 w-32 bg-base-300 rounded" />
            <div className="h-4 w-48 bg-base-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
