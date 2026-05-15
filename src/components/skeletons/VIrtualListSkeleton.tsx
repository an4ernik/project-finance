const VirtualItemSkeleton = () => {
  return (
    <div className="group relative min-h-[112px] flex items-center rounded-xl p-5 gap-4 animate-pulse bg-white dark:bg-[#193432] border border-slate-100 dark:border-none">
      {/* Icon Placeholder */}
      <div className="size-10 hidden sm:flex shrink-0 rounded-lg bg-gray-200 dark:bg-[#1c3f35]/50" />

      <div className="relative flex items-center justify-between w-full flex-wrap gap-4">
        {/* Text Info Side */}
        <div className="flex flex-col gap-2">
          {/* Title / Category */}
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-[#1c3f35]/50" />
          {/* Description */}
          <div className="h-4 w-48 rounded bg-gray-200/60 dark:bg-[#1c3f35]/30" />
          {/* Date */}
          <div className="h-3 w-20 rounded bg-gray-200/40 dark:bg-[#1c3f35]/20" />
        </div>

        {/* Amount Side */}
        <div className="flex items-center gap-5 ml-auto">
          {/* Amount Number */}
          <div className="h-8 w-24 rounded bg-gray-200 dark:bg-[#1c3f35]/50" />

          {/* Buttons Placeholder (Desktop) */}
          <div className="hidden sm:flex gap-4">
            <div className="size-10 rounded-lg bg-gray-200 dark:bg-[#1c3f35]/50" />
            <div className="size-10 rounded-lg bg-gray-200 dark:bg-[#1c3f35]/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

const VirtualListSkeleton = ({count = 3}: {count?: number}) => {
  return (
    <div className="flex flex-col gap-3 w-full pt-9">
      <div className="h-8 w-24 rounded bg-gray-200 dark:bg-[#1c3f35]/50" />
      {Array.from({length: count}).map((_, i) => (
        <VirtualItemSkeleton key={i} />
      ))}
    </div>
  );
};

export default VirtualListSkeleton;
