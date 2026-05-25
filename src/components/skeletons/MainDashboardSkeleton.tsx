import { cn } from '@/lib/utils'; 

const MainDashboardSkeleton = () => {
  return (
    <div className="flex h-screen w-full bg-[#EEF3F2] dark:bg-[#0C1412] font-sans antialiased text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* SIDEBAR SKELETON */}
      <aside className="w-64 border-r border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-[#091816] flex flex-col justify-between p-6 h-full shrink-0">
        <div>
          {/* Logo Brand */} 
          <div className="flex items-center gap-3 mb-12 animate-pulse">
            <div className="h-7 w-28 bg-slate-200 dark:bg-emerald-950/50 rounded-md" />
            <div className="size-6 bg-slate-300 dark:bg-emerald-800/60 rounded-full" />
          </div>

          {/* Nav Items */}
          <nav className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="size-5 rounded bg-slate-200 dark:bg-emerald-950/40" />
                <div className={`h-4 bg-slate-200 dark:bg-emerald-950/40 rounded-md ${i === 1 ? 'w-24' : 'w-20'}`} />
              </div>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 animate-pulse pt-4 border-t border-slate-100 dark:border-emerald-950/20">
            <div className="size-5 rounded bg-slate-200 dark:bg-emerald-950/40" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-emerald-950/40 rounded-md" />
          </div>
          
          <div className="flex gap-3 pt-2">
            <div className="size-10 rounded-xl bg-slate-100 dark:bg-emerald-950/30 animate-pulse border dark:border-emerald-950/40" />
            <div className="w-20 h-10 rounded-xl bg-slate-100 dark:bg-emerald-950/30 animate-pulse border dark:border-emerald-950/40" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="h-full flex flex-col overflow-y-auto p-8 max-w-7xl mx-auto w-full">
        
        {/* TOP BAR ACTION STRIP */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="h-7 w-20 bg-slate-300 dark:bg-emerald-900/40 rounded-md mb-2 animate-pulse" />
            <div className="h-5 w-48 bg-slate-200 dark:bg-emerald-950/40 rounded-md animate-pulse" />
          </div>
          
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-36 h-10 rounded-xl bg-slate-200 dark:bg-emerald-950/40 border dark:border-emerald-950/30" />
            <div className="w-32 h-10 rounded-xl bg-slate-300 dark:bg-emerald-800/40" />
            <div className="size-8 rounded-full bg-slate-200 dark:bg-emerald-950/40 ml-2" />
          </div>
        </header>

        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* BLOCK 1:*/}
        <div className="rounded-2xl border border-slate-100 dark:border-none bg-white dark:bg-[#315F551A] p-6 space-y-6 w-full">
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
 
      </main>
    </div>
  );
};

export default MainDashboardSkeleton;

const SkeletonBox = ({className}: {className?: string}) => (
  <div
    className={cn(
      'rounded bg-gray-200 dark:bg-[#142624] animate-pulse transition-all duration-300 [animation-duration:1.3s]',
      className,
    )}
  />
);