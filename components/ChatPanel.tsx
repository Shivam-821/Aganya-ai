"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Prediction {
  forecast_sales: number;
  projected_revenue: number;
  potential_waste_inr: number;
  risk_flags: string[];
  policy_impact: {
    repo_rate_effect: string;
    inflation_effect: string;
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modifiedPrediction?: Prediction;
}

interface ChatPanelProps {
  reportId: string;
  onPredictionUpdate?: (prediction: Prediction) => void;
}

export default function ChatPanel({
  reportId,
  onPredictionUpdate,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [overrideMode, setOverrideMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const { getToken } = useAuth();

  const handleSend = async () => {
    const currentInput = input;
    if (!currentInput.trim() && !overrideMode) return;

    // Optimistic UI Update
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content:
        currentInput || (overrideMode ? "Modified Simulation Parameters" : ""),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Authentication failed. Please sign in again.",
          },
        ]);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      // Longer timeout for AI responses (90s for Gemini + ML model)
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const payload = overrideMode
        ? {
            message: input || "Explain the changes in the forecast",
            mode: "modify_report",
            report_id: reportId,
            overrides: Object.fromEntries(
              Object.entries(overrides)
                .filter(([, v]) => v !== "")
                .map(([k, v]) => [k, parseFloat(v) || v]),
            ),
          }
        : {
            message: input,
            mode: "chat",
            context: { report_id: reportId },
          };

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that request.",
        modifiedPrediction: data.modified_prediction,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.modified_prediction && onPredictionUpdate) {
        onPredictionUpdate(data.modified_prediction);
      }

      // Reset override mode after successful request
      if (overrideMode) {
        setOverrideMode(false);
        setOverrides({});
      }
    } catch (err) {
      let errorContent =
        "Failed to connect to the AI assistant. Please try again.";
      if (err instanceof Error && err.name === "AbortError") {
        errorContent =
          "The AI is taking longer than expected. Please try a simpler question or try again later.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleOverrideChange = (key: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-800/20 rounded-xl border border-zinc-800/50">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-zinc-800 dark:text-zinc-100">
              AI Assistant <strong>Bhrigu</strong>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Ask questions or modify the forecast
            </p>
          </div>
          <button
            onClick={() => setOverrideMode(!overrideMode)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              overrideMode
                ? "bg-amber-300/20 text-amber-800 dark:text-amber-200 border border-amber-500/80 dark:border-amber-500/20"
                : "bg-zinc-800 text-zinc-200 hover:text-zinc-100"
            }`}
          >
            {overrideMode ? "Override Mode ON" : "Modify Forecast"}
          </button>
        </div>
      </div>

      {/* Override panel */}
      {overrideMode && (
        <div className="p-4 border-b border-zinc-800/50 bg-amber-500/5">
          <p className="text-xs text-amber-800 dark:text-amber-300 mb-3">
            Adjust parameters to see how they affect the forecast:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "unit_price", label: "Unit Price", placeholder: "4500" },
              {
                key: "current_inventory",
                label: "Inventory",
                placeholder: "50",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-800 dark:text-zinc-100 mb-1">
                  {label}
                </label>
                <input
                  type="number"
                  value={overrides[key] || ""}
                  onChange={(e) => handleOverrideChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm bg-zinc-800/40 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600
                           focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-zinc-800/50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-zinc-700 dark:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Ask questions about this forecast or use Override Mode to modify
              parameters
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-teal-500 text-white"
                    : "bg-zinc-800 text-zinc-100"
                }`}
              >
                {/* Render Markdown Content */}
                <div className="text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Modified prediction display */}
                {msg.modifiedPrediction && (
                  <div className="mt-3 pt-3 border-t border-zinc-700/50">
                    <p className="text-xs text-emerald-400 mb-2">
                      New Prediction:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-zinc-400">Sales:</span>{" "}
                        <span className="text-white font-medium">
                          {msg.modifiedPrediction.forecast_sales}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Revenue:</span>{" "}
                        <span className="text-emerald-400 font-medium">
                          ₹
                          {msg.modifiedPrediction.projected_revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800/40">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={
              overrideMode
                ? "Explain the changes..."
                : "Ask about this forecast..."
            }
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl
                     text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-500 text-sm
                     focus:outline-none focus:ring-2 focus:ring-teal-500/50
                     disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || (!input.trim() && !overrideMode)}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50
                     text-white rounded-xl transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
