"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-white text-black rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}
