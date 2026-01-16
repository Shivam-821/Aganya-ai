"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Jewelry",
  "Automotive",
  "Grocery",
  "Home",
];
const REGIONS = ["Tier-1", "Tier-2", "Tier-3", "Rural"];

export default function NewSimulationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product_name: "",
    category: "Fashion",
    region: "Tier-1",
    unit_price: "",
    current_inventory: "",
    prediction_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for ML prediction

      const payload = {
        ...formData,
        unit_price: parseFloat(formData.unit_price),
        current_inventory: parseInt(formData.current_inventory),
      };

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/fb5f8066-a7b3-41e4-a85d-332644014073",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "new/page.tsx:submit",
            message: "Sending request",
            data: { api_url: API_URL, payload },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "F",
          }),
        }
      ).catch(() => {});
      // #endregion

      const res = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/fb5f8066-a7b3-41e4-a85d-332644014073",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "new/page.tsx:response",
            message: "Got response",
            data: { status: res.status, ok: res.ok },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "F",
          }),
        }
      ).catch(() => {});
      // #endregion

      const data = await res.json();

      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/fb5f8066-a7b3-41e4-a85d-332644014073",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "new/page.tsx:data",
            message: "Parsed JSON",
            data: {
              success: data.success,
              hasData: !!data.data,
              error: data.error,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "F",
          }),
        }
      ).catch(() => {});
      // #endregion

      if (data.success) {
        router.push(`/simulations/${data.data.id}`);
      } else {
        setError(data.error || "Failed to create simulation");
      }
    } catch (err) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/fb5f8066-a7b3-41e4-a85d-332644014073",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "new/page.tsx:catch",
            message: "Request failed",
            data: {
              error: err instanceof Error ? err.message : String(err),
              name: err instanceof Error ? err.name : "unknown",
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "F",
          }),
        }
      ).catch(() => {});
      // #endregion
      if (err instanceof Error && err.name === "AbortError") {
        setError(
          "Request timed out. The prediction is taking longer than expected."
        );
      } else {
        setError("Failed to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          New Simulation
        </h1>
        <p className="text-muted-foreground">
          Enter product details to generate a demand forecast prediction
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="e.g., Fancy Silk Saree"
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl 
                     text-foreground placeholder-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                     transition-all"
          />
        </div>

        {/* Category & Region */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl 
                       text-foreground 
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       transition-all appearance-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-card text-foreground"
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Region
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl 
                       text-foreground 
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       transition-all appearance-none cursor-pointer"
            >
              {REGIONS.map((region) => (
                <option
                  key={region}
                  value={region}
                  className="bg-card text-foreground"
                >
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Inventory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Unit Price (INR)
            </label>
            <input
              type="number"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              placeholder="4500"
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl 
                       text-foreground placeholder-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Current Inventory
            </label>
            <input
              type="number"
              name="current_inventory"
              value={formData.current_inventory}
              onChange={handleChange}
              required
              min="0"
              placeholder="50"
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl 
                       text-foreground placeholder-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       transition-all"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Used for waste risk calculation
            </p>
          </div>
        </div>

        {/* Prediction Date */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Prediction Date
          </label>
          <input
            type="date"
            name="prediction_date"
            value={formData.prediction_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl 
                     text-foreground 
                     focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                     transition-all"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            The date for which you want to forecast demand
          </p>
        </div>

        {/* Info card */}
        <div className="p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-primary"
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
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-1">
                What will be calculated?
              </h4>
              <p className="text-xs text-muted-foreground">
                Our AI model will analyze your inputs along with RBI Repo Rates,
                CPI Inflation, and seasonal factors (Diwali, Wedding Season,
                Harvest) to predict demand and identify risks.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50
                     text-primary-foreground font-medium rounded-xl transition-colors
                     flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Forecast...
              </>
            ) : (
              <>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate Forecast
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
