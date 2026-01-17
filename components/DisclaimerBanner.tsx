"use client";

import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-400 dark:bg-yellow-500 text-black py-2.5 px-4 z-[100] flex items-center justify-center text-center text-sm font-bold shadow-lg shadow-black/10">
      <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
      <span>
        Disclaimer: This is an AI prediction so it may be inaccurate. Please use
        with discretion.
      </span>
    </div>
  );
}
