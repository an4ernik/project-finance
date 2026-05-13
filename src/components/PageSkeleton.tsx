export const PageSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col gap-6 p-6 animate-pulse">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded-md bg-muted/20" />
        <div className="h-10 w-32 rounded-md bg-muted/20" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Large Chart Area */}
        <div className="lg:col-span-2 h-[400px] rounded-xl border border-white/10 bg-white/5" />

        {/* Sidebar Info/Pie Chart */}
        <div className="h-[400px] rounded-xl border border-white/10 bg-white/5" />
      </div>

      {/* Table/List Area */}
      <div className="h-[300px] w-full rounded-xl border border-white/10 bg-white/5" />
    </div>
  );
};
