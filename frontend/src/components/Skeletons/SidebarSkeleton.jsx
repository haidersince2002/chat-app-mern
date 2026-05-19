const SidebarSkeleton = () => (
  <aside className="w-full h-full bg-card border-r border-border flex flex-col">
    <div className="p-4 border-b border-border space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-muted animate-pulse" />
        <div className="w-20 h-4 rounded bg-muted animate-pulse" />
      </div>
      <div className="w-full h-8 rounded-lg bg-muted animate-pulse" />
    </div>
    <div className="flex-1 p-2 space-y-1">
      {Array(7).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-28 h-3 rounded bg-muted animate-pulse" />
            <div className="w-16 h-2.5 rounded bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </aside>
);
export default SidebarSkeleton;
