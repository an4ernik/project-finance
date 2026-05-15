export const PageSkeleton = () => {
  return (
    <div className="flex flex-col w-full h-full animate-pulse">
      {/* 1. Header Area (Matches your layout's top section) */}
      <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center w-full mb-8">
        <div className="flex flex-col gap-2">
          {/* Title Placeholder */}
          <div className="h-8 w-48 rounded-md bg-gray-200 dark:bg-[#1c3f35]/50" />
          {/* Subtitle Placeholder */}
          <div className="h-4 w-64 rounded-md bg-gray-200/60 dark:bg-[#1c3f35]/30" />
        </div>

        {/* Action Button/Avatar Placeholder */}
        <div className="hidden md:flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-[#1c3f35]/50" />
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-[#1c3f35]/50" />
        </div>
      </div>

      {/* 2. Main Block Area */}
      <div className="flex-1 w-full space-y-6">
        {/* Large Main Content Card */}
        <div className="w-full h-[500px] rounded-2xl border border-gray-200 dark:border-[#1c3f35] bg-gray-100/50 dark:bg-[#0b1514]/20" />

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[300px] rounded-2xl border border-gray-200 dark:border-[#1c3f35] bg-gray-100/50 dark:bg-[#0b1514]/20" />
          <div className="h-[300px] rounded-2xl border border-gray-200 dark:border-[#1c3f35] bg-gray-100/50 dark:bg-[#0b1514]/20" />
        </div>
      </div>
    </div>
  );
};
