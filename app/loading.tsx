export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
