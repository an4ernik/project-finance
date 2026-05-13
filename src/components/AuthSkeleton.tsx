export const AuthSkeleton = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 animate-pulse">
      <div className="w-full max-w-[400px] space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        {/* Logo/Title Area */}
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-xl bg-muted/20" />
          <div className="h-6 w-32 rounded-md bg-muted/20" />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted/20" />
            <div className="h-12 w-full rounded-lg bg-muted/10 border border-white/5" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted/20" />
            <div className="h-12 w-full rounded-lg bg-muted/10 border border-white/5" />
          </div>
        </div>

        {/* Button */}
        <div className="h-12 w-full rounded-lg bg-muted/20 mt-8" />

        {/* Bottom Link */}
        <div className="mx-auto h-4 w-48 rounded bg-muted/10 mt-6" />
      </div>
    </div>
  );
};
