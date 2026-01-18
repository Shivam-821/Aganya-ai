"use client";

import { useState } from "react";

interface InfoTooltipProps {
  title: string;
  description: string;
  formula?: string;
}

export function InfoTooltip({ title, description, formula }: InfoTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors cursor-help"
      >
        <svg
          className="w-3 h-3 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {isHovered && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-popover border border-border rounded-lg shadow-xl">
          <div className="text-sm font-semibold text-popover-foreground mb-2">
            {title}
          </div>
          <div className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {description}
          </div>
          {formula && (
            <div className="mt-2 p-2 bg-muted/50 rounded border border-border">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                Calculation:
              </div>
              <code className="text-xs font-mono text-foreground">
                {formula}
              </code>
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-border" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-[7px] border-transparent border-t-popover" />
          </div>
        </div>
      )}
    </div>
  );
}
