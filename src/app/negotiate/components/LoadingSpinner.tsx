"use client";

export default function LoadingSpinner() {
  return (
    <div className="w-full grid place-items-center">
      <div className="flex w-16 h-16 overflow-hidden items-center justify-center">
        <div className="w-16 h-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
      </div>
    </div>
  );
}
