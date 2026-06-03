"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">You are offline</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Please check your internet connection to view this page. Other parts of the app may be available offline.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium"
      >
        Try Again
      </button>
    </div>
  );
}
