"use client";

export default function ErrorHomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-red-600">
          Something went wrong
        </h1>
        <p className="mt-2 text-gray-600">
          Please try refreshing the page or come back later.
        </p>
      </div>
    </div>
  );
}
