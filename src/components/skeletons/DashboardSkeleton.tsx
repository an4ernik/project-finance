import {cn} from '@/lib/utils';

const SkeletonBox = ({className}: {className?: string}) => (
  <div
    className={cn(
      'rounded bg-gray-200 dark:bg-[#142624] animate-pulse',
      className,
    )}
  />
);

export const DashboardSkeleton = () => {
  return (
    <div className="w-full space-y-10 p-6">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BLOCK 1:*/}
        <div className="rounded-2xl border border-slate-100 dark:border-none bg-white dark:bg-[#315F551A] p-6 space-y-6">
          <SkeletonBox className="h-6 w-40" /> {/* Section Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SkeletonBox className="h-32 rounded-xl dark:bg-[#142624]" />
            <SkeletonBox className="h-32 rounded-xl dark:bg-[#142624]" />
            <SkeletonBox className="h-32 rounded-xl dark:bg-[#142624]" />
          </div>
        </div>

        {/* BLOCK 2:*/}
        <div className="rounded-2xl border border-slate-100 dark:border-none bg-white dark:bg-[#315F551A] p-6 space-y-8">
          <div className="flex justify-between items-center">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-9 w-28 rounded-lg" />
          </div>
          <div className="space-y-6 py-2">
            <div className="flex items-center gap-4">
              <SkeletonBox className="h-4 w-12" />
              <SkeletonBox className="h-10 flex-1 rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <SkeletonBox className="h-4 w-12" />
              <SkeletonBox className="h-10 w-1/4 rounded-lg" />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
            <SkeletonBox className="h-5 w-40" />
            <SkeletonBox className="h-7 w-24 bg-emerald-500/20" />
          </div>
        </div>

        {/* BLOCK 3:*/}
        <div className="rounded-2xl border border-slate-100 dark:border-none bg-white dark:bg-[#315F551A] p-6 space-y-6">
          <div className="flex justify-between items-center">
            <SkeletonBox className="h-6 w-40" />
            <SkeletonBox className="h-9 w-28 rounded-lg" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-10 py-6">
            {/* Donut Simulation */}
            <div className="size-44 rounded-full border-[18px] border-gray-200 dark:border-[#142624] flex items-center justify-center">
              <SkeletonBox className="size-12 rounded" />
            </div>
            <div className="flex-1 space-y-4 w-full">
              <SkeletonBox className="h-11 w-full rounded-xl dark:bg-[#142624]" />
              <SkeletonBox className="h-11 w-full rounded-xl dark:bg-[#142624]" />
            </div>
          </div>
        </div>

        {/* BLOCK 4: Динаміка балансу */}
        <div className="rounded-2xl border border-slate-100 dark:border-none bg-white dark:bg-[#315F551A] p-6 space-y-6">
          <div className="flex justify-between items-center">
            <SkeletonBox className="h-6 w-40" />
            <SkeletonBox className="h-9 w-28 rounded-lg" />
          </div>
          <div className="h-48 w-full flex items-end gap-3 px-2">
            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.5].map((_, i) => (
              <SkeletonBox
                key={i}
                className="flex-1 rounded-t-sm bg-gray-200/50 dark:bg-[#142624]"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
            <SkeletonBox className="h-4 w-full dark:bg-[#142624]" />
            <SkeletonBox className="h-4 w-full dark:bg-[#142624]" />
            <SkeletonBox className="h-4 w-full dark:bg-[#142624]" />
          </div>
        </div>
      </div>
    </div>
  );
};
