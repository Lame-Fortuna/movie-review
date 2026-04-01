export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
        <p className="animate-pulse text-sm font-medium text-gray-400">Loading...</p>
      </div>
    </div>
  );
}