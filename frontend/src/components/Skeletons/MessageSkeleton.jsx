const MessageSkeleton = () => (
  <div className="flex-1 p-4 space-y-4 overflow-hidden">
    {Array(6).fill(0).map((_, i) => (
      <div key={i} className={`flex items-end gap-2 ${i % 2 !== 0 ? "justify-end" : ""}`}>
        {i % 2 === 0 && <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0" />}
        <div className="space-y-1.5">
          <div className={`h-10 rounded-2xl bg-muted animate-pulse ${i % 2 === 0 ? "w-48 rounded-bl-sm" : "w-36 rounded-br-sm"}`} />
          <div className={`h-2 w-12 rounded bg-muted animate-pulse ${i % 2 !== 0 ? "ml-auto" : ""}`} />
        </div>
        {i % 2 !== 0 && <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0" />}
      </div>
    ))}
  </div>
);
export default MessageSkeleton;
