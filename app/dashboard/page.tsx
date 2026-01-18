"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import NewsWidget from "@/components/NewsWidget";
import { InfoTooltip } from "@/components/InfoTooltip";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Jewelry",
  "Automotive",
  "Grocery",
  "Home",
];
// Valid States from Backend
const STATES = [
  "Delhi",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "Maharashtra",
  "Gujarat",
  "Karnataka",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Bihar",
  "West Bengal",
];
const REGIONS = ["Tier-1", "Tier-2", "Tier-3", "Rural"];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [categoryDist, setCategoryDist] = useState<any[]>([]);
  const [stateCategories, setStateCategories] = useState<any[]>([]);
  const [economicTrends, setEconomicTrends] = useState<any[]>([]);

  // Fetch Category Data
  useEffect(() => {
    fetch(`${API_URL}/dashboard/categories`)
      .then((res) => res.json())
      .then((data) => setCategoryDist(data))
      .catch((err) => console.error("Failed to load categories", err));

    fetch(`${API_URL}/dashboard/state-categories`)
      .then((res) => res.json())
      .then((data) => setStateCategories(data))
      .catch((err) => console.error("Failed to load state categories", err));

    fetch(`${API_URL}/dashboard/economics`)
      .then((res) => res.json())
      .then((data) => setEconomicTrends(data))
      .catch((err) => console.error("Failed to load economics", err));
  }, []);

  const [selectedTrendCategory, setSelectedTrendCategory] = useState("All");

  // Form State
  const [formData, setFormData] = useState({
    product_name: "",
    category: "Fashion",
    region: "Tier-1",
    state: "Delhi",
    model_type: "advanced", // 'advanced' or 'explainable'
    unit_price: "",
    current_inventory: "",
    prediction_date: new Date().toISOString().split("T")[0],
  });

  // Fetch Trends on Mount or Category Change
  useEffect(() => {
    fetch(`${API_URL}/dashboard/trends?category=${selectedTrendCategory}`)
      .then((res) => res.json())
      .then((data) => setTrends(data))
      .catch((err) => console.error("Failed to load trends", err));
  }, [selectedTrendCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        unit_price: parseFloat(formData.unit_price),
        current_inventory: parseInt(formData.current_inventory),
      };

      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Prediction Failed. Is Backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 md:pt-5 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Demand Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Policy-Aware Forecasting for Indian Startups and MSMEs
            </p>
          </div>
          <a
            href="/simulations"
            className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-gray-300/80 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            View Simulations
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12 overflow-hidden">
          {/* LEFT: INPUT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 relative"
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary"></div>

            {/* Main container with subtle background */}
            <div className="relative bg-gradient-to-br from-background via-background to-muted/20 p-6 pt-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-primary to-primary/30"></span>
                Demand Forecast
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative group">
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Product Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      className="w-full bg-muted/50 border-0 border-l-2 border-primary/30 px-4 py-3 outline-none focus:border-primary transition-colors clip-corner"
                      placeholder="Fancy Silk Saree"
                      required
                    />
                    <div className="absolute right-0 top-0 w-8 h-8 border-r border-t border-primary/20"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 opacity-70">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-muted/50 border-0 border-l-2 border-primary/30 px-4 py-3 outline-none focus:border-primary transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2 opacity-70">
                      Target State
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-muted/50 border-0 border-l-2 border-primary/30 px-4 py-3 outline-none focus:border-primary transition-colors"
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* MODEL SELECTION - Geometric cards */}
                <div className="relative p-4 bg-muted/20 border border-border/50">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 clip-corner-sm"></div>
                  <label className="block text-base font-semibold mb-3">
                    AI Model Engine
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, model_type: "advanced" })
                      }
                      className={`relative p-3 text-sm font-medium transition-all overflow-hidden ${
                        formData.model_type === "advanced"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted text-muted-foreground"
                      }`}
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                      }}
                    >
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 ${formData.model_type === "advanced" ? "bg-primary-foreground/20" : "bg-muted"}`}
                      ></div>
                      ⚡ Advanced AI
                      <span className="block text-[10px] opacity-70 font-normal mt-1">
                        High Accuracy Stacking
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, model_type: "explainable" })
                      }
                      className={`relative p-3 text-sm font-medium transition-all overflow-hidden ${
                        formData.model_type === "explainable"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background hover:bg-muted text-muted-foreground"
                      }`}
                      style={{
                        clipPath:
                          "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                      }}
                    >
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 ${formData.model_type === "explainable" ? "bg-primary-foreground/20" : "bg-muted"}`}
                      ></div>
                      🧠 Explainable
                      <span className="block text-[10px] opacity-70 font-normal mt-1">
                        Understand the "Why"
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {formData.model_type === "advanced"
                      ? "The Advanced AI model provides the most accurate forecasts using Deep Ensemble Learning."
                      : "The Explainable model helps understand which factors (Fuel, Inflation, Season) influence sales."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="unit_price"
                      value={formData.unit_price}
                      onChange={handleChange}
                      className="w-full bg-muted/50 border-0 border-l-2 border-primary/30 px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="4500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-70">
                      Stock Level
                    </label>
                    <input
                      type="number"
                      name="current_inventory"
                      value={formData.current_inventory}
                      onChange={handleChange}
                      className="w-full bg-muted/50 border-0 border-l-2 border-primary/30 px-4 py-3 outline-none focus:border-primary transition-colors"
                      placeholder="50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Prediction Date
                  </label>
                  <input
                    type="date"
                    name="prediction_date"
                    value={formData.prediction_date}
                    onChange={handleChange}
                    className="w-full bg-muted/50 border-0 border-l-2 border-primary/30 px-4 py-3 outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 font-semibold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  }}
                >
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-primary-foreground/20 border-l-[16px] border-l-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    "Generate Forecast"
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT: RESULTS PANEL */}
          <div className="space-y-8">
            {loading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-card border border-border rounded-2xl shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/5 blur-3xl animate-pulse"></div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative z-10"
                >
                  <Loader2 className="w-16 h-16 text-primary" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-xl font-medium text-foreground relative z-10"
                >
                  Analyzing Market Trends...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-2 text-sm text-muted-foreground relative z-10"
                >
                  Calculating Inflation Impact...
                </motion.p>
              </motion.div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden"
              >
                {/* Corner Brackets for Results */}
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-green-500"></div>

                {/* Diagonal Accent Stripe */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-primary to-transparent"></div>

                <div className="relative bg-gradient-to-br from-background via-background to-green-500/5 p-8 pt-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 relative z-10">
                    <span className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-500/30"></span>
                    AI Prediction Results
                  </h2>

                  {/* Forecast Period Disclaimer */}
                  <div className="mb-6 relative border-l-2 border-blue-500/50 pl-4 py-2 bg-blue-500/5">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-blue-500/30"></div>
                    <p className="text-xs text-blue-400 flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        <strong>Forecast Period:</strong> This prediction
                        represents expected demand for approximately 30 days
                        around the selected date, using macro-economic
                        conditions (Repo Rate, CPI, GDP) applicable to that
                        period.
                      </span>
                    </p>
                  </div>

                  {/* Key Metrics - Hexagonal/Clipped Corner Cards */}
                  <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                    <div
                      className="relative p-5 bg-gradient-to-br from-muted/40 to-muted/20 border border-border/50 overflow-hidden group hover:border-primary/50 transition-colors"
                      style={{
                        clipPath:
                          "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)",
                      }}
                    >
                      <div className="absolute top-0 left-0 w-3 h-3 bg-primary/20"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <p className="text-sm opacity-60 mb-2">
                        Forecasted Sales
                      </p>
                      <p className="text-4xl font-bold">
                        {result.forecast_sales}{" "}
                        <span className="text-sm font-normal opacity-50">
                          units
                        </span>
                      </p>
                    </div>
                    <div
                      className="relative p-5 bg-gradient-to-br from-green-500/10 to-muted/20 border border-green-500/30 overflow-hidden group hover:border-green-500/60 transition-colors"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                      }}
                    >
                      <div className="absolute top-0 right-0 w-3 h-3 bg-green-500/30"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <p className="text-sm opacity-60 mb-2">
                        Revenue Potential
                      </p>
                      <p className="text-4xl font-bold text-green-500">
                        ₹{result.projected_revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* NEW: SENTIMENT & CONFIDENCE - Plus pattern borders */}
                  <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
                    <div className="relative p-4 bg-muted/20">
                      {/* Plus pattern borders */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                      <p className="text-sm opacity-60 mb-1">
                        Market Sentiment
                      </p>
                      <p
                        className={`font-bold text-lg ${
                          result.market_sentiment?.includes("Bullish")
                            ? "text-green-500"
                            : result.market_sentiment?.includes("Bearish")
                              ? "text-amber-500"
                              : "text-blue-500"
                        }`}
                      >
                        {result.market_sentiment || "Neutral"}
                      </p>
                    </div>
                    <div className="relative p-4 bg-muted/20">
                      {/* Plus pattern borders */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                      <p className="text-sm opacity-60 mb-2">AI Confidence</p>
                      <div className="w-full bg-muted/50 h-2.5 mb-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                        <div
                          className="bg-gradient-to-r from-primary to-green-500 h-2.5 relative z-10"
                          style={{ width: `${result.confidence_score || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-right font-mono opacity-70">
                        {result.confidence_score || 0}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* RISK FLAGS - Geometric badges */}
                <div className="mb-6 relative z-10">
                  <p className="text-sm font-bold opacity-70 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-8 h-0.5 bg-gradient-to-r from-border to-transparent"></span>
                    Risk Analysis
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.risk_flags.length > 0 ? (
                      result.risk_flags.map((flag: string, i: number) => {
                        const isGreen = flag.includes("Sufficient Stock");
                        return (
                          <span
                            key={i}
                            className={`relative px-3 py-1.5 border text-sm font-medium overflow-hidden group ${
                              isGreen
                                ? "bg-green-500/10 text-green-500 border-green-500/30"
                                : "bg-red-500/10 text-red-500 border-red-500/30"
                            }`}
                            style={{
                              clipPath:
                                "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                            }}
                          >
                            <div
                              className={`absolute top-0 left-0 w-1 h-1 ${isGreen ? "bg-green-500/30" : "bg-red-500/30"}`}
                            ></div>
                            <div
                              className={`absolute bottom-0 right-0 w-1 h-1 ${isGreen ? "bg-green-500/30" : "bg-red-500/30"}`}
                            ></div>
                            {isGreen ? "✓ " : "⚠ "}
                            {flag}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-green-500 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Low Risk Detected
                      </span>
                    )}
                  </div>
                  {result.potential_waste_inr > 0 && (
                    <div className="mt-4 relative border-l-2 border-red-500/40 pl-4 py-3 bg-red-900/5">
                      <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-red-500/20"></div>
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-red-600 text-lg">
                          ₹{result.potential_waste_inr.toLocaleString()}
                        </div>
                        <div className="text-sm opacity-80 flex items-center">
                          Estimated waste if stock isn't cleared.
                          <InfoTooltip
                            title="Potential Waste (Holding Cost)"
                            description="This represents the estimated holding cost for excess inventory that may not sell. It's calculated as 20% of the total value of unsold units, accounting for storage, insurance, depreciation, and opportunity costs."
                            formula="Excess Units × Unit Price × 0.2 (20% holding cost)"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* VISUALIZATION: FINANCIAL HEALTH - Corner bracket frame */}
                <div className="mb-6 relative">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-border/50"></div>
                  <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-border/50 z-10"></div>
                  <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-border/50 z-10"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-l border-b border-border/50 z-10"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-border/50 z-10"></div>

                  <div className="p-4 bg-muted/10 relative">
                    <p className="text-xs font-bold opacity-60 mb-4 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-gradient-to-r from-primary to-transparent"></span>
                      Financial Projection
                    </p>
                    <div className="h-[150px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={[
                            {
                              name: "Revenue",
                              value: result.projected_revenue,
                              fill: "#22c55e",
                            },
                            {
                              name: "Potential Waste",
                              value: result.potential_waste_inr,
                              fill: "#ef4444",
                            },
                          ]}
                        >
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "none",
                              background: "#333",
                              color: "#fff",
                            }}
                          />
                          <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* EXPLAINABLE AI CHART - Minimal frame */}
                {result.explanation && (
                  <div className="mb-6 relative">
                    {/* Minimal corner frame */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-l border-t border-indigo-500/30 z-10"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-r border-b border-indigo-500/30 z-10"></div>

                    <div className="p-4 bg-gradient-to-br from-indigo-500/5 to-transparent">
                      <p className="text-xs font-bold text-indigo-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                        🧠 What Drives this Forecast?
                      </p>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={Object.entries(result.explanation).map(
                              ([key, val]) => ({
                                name: key.replace("Impact", "").trim(),
                                value: val,
                                fill: Number(val) > 0 ? "#22c55e" : "#ef4444",
                              }),
                            )}
                            margin={{ left: 10 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              horizontal={false}
                              opacity={0.2}
                            />
                            <XAxis type="number" />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={90}
                              style={{ fontSize: "11px" }}
                            />
                            <Tooltip
                              cursor={{ fill: "transparent" }}
                              formatter={(value: any) => [
                                `${Number(value).toFixed(4)} Units`,
                                "Impact",
                              ]}
                              contentStyle={{
                                backgroundColor: "#111",
                                borderRadius: "8px",
                                border: "none",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              radius={[4, 4, 4, 4]}
                              barSize={20}
                            ></Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        Positive values increase sales. Negative values decrease
                        sales.
                      </p>
                    </div>
                  </div>
                )}

                {/* POLICY IMPACT - L-shaped border */}
                <div className="relative border-l-2 border-primary/30 pl-4 py-4 bg-primary/5">
                  <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/40"></div>
                  <p className="text-xs font-bold text-blue-500 mb-2 uppercase">
                    Policy Impact Engine
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-70">Interest Rate Effect:</span>
                      <span className="font-medium">
                        {result.policy_impact.repo_rate_effect}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Inflation Drag:</span>
                      <span className="font-medium">
                        {result.policy_impact.inflation_effect}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Dynamic Layout: Show News Widget here when no result
              <div className="h-full">
                <NewsWidget />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Layout: Show Full Width News Widget ONLY when result exists */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-12"
          >
            <NewsWidget />
          </motion.div>
        )}

        {/* BOTTOM: MARKET INSIGHTS GRID */}
        <div className="grid md:grid-cols-3 gap-8 pb-12">
          {/* 1. MAIN TRENDS CHART (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 relative"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-primary/50"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-primary/50"></div>

            <div className="bg-gradient-to-br from-background via-background to-primary/5 p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Market vs Policy Trends
                </h2>
                <div className="mt-4 md:mt-0">
                  <select
                    value={selectedTrendCategory}
                    onChange={(e) => setSelectedTrendCategory(e.target.value)}
                    className="bg-muted border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="All">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="Month_Str" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        name === "Sales" ? value : Number(value).toFixed(4),
                        name,
                      ]}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderColor: "#333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="Sales_Qty"
                      stroke="#14b8a6"
                      name="Sales"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="step"
                      dataKey="RBI_Repo_Rate"
                      stroke="#ff7300"
                      name="Repo Rate %"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 2. CATEGORY DISTRIBUTION (Span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex flex-col"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 right-0 w-10 h-10 border-r border-t border-green-500/50"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-l border-b border-green-500/50"></div>

            <div className="bg-gradient-to-br from-background via-background to-green-500/5 p-8 flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-6">Sales by Category</h2>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDist}
                      dataKey="Sales_Qty"
                      nameKey="Category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {categoryDist.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#3b82f6", // Blue
                              "#10b981", // Emerald
                              "#ec4899", // Pink
                              "#8b5cf6", // Violet
                              "#06b6d4", // Cyan
                              "#00b00d", // Green
                              "#f59e0b", // Amber
                            ][index % 7]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111",
                        borderRadius: "8px",
                        border: "none",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* 4. INFLATION AREA CHART (Span 4 - Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 relative"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l border-t border-amber-500/50"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-r border-t border-amber-500/50"></div>

            <div className="bg-gradient-to-br from-background via-background to-amber-500/5 p-8">
              <h2 className="text-xl font-semibold mb-6">
                Inflation Impact Tracking
              </h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends}>
                    <defs>
                      <linearGradient
                        id="colorInflation"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="Month_Str" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <Tooltip
                      formatter={(value: any) => Number(value).toFixed(4)}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="CPI_Inflation"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorInflation)"
                      name="Inflation (CPI)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. NEW: STATE-WISE & ECONOMIC INSIGHTS */}
        <div className="grid md:grid-cols-2 gap-8 pb-12">
          {/* STATE-WISE CONSUMPTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-10 h-10 border-l border-t border-purple-500/50"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 border-r border-b border-purple-500/50"></div>

            <div className="bg-gradient-to-br from-background via-background to-purple-500/5 p-8">
              <h2 className="text-xl font-semibold mb-6">
                State-wise Consumption
              </h2>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateCategories}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    {CATEGORIES.map((cat, index) => (
                      <Bar
                        key={cat}
                        dataKey={cat}
                        stackId="a"
                        fill={
                          [
                            "#8884d8",
                            "#82ca9d",
                            "#ffc658",
                            "#ff6842",
                            "#0088fe",
                            "#5100caff",
                          ][index % 6]
                        }
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* MACRO-ECONOMIC DRIVERS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 right-0 w-10 h-10 border-r border-t border-cyan-500/50"></div>
            <div className="absolute bottom-0 left-0 w-10 h-10 border-l border-b border-cyan-500/50"></div>

            <div className="bg-gradient-to-br from-background via-background to-cyan-500/5 p-8">
              <h2 className="text-xl font-semibold mb-6">
                Macro-Economic Drivers
              </h2>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={economicTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="Month_Str" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      label={{
                        value: "Fuel Price (₹)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{
                        value: "GDP Growth %",
                        angle: 90,
                        position: "insideRight",
                      }}
                    />
                    <Tooltip
                      formatter={(value: any) => Number(value).toFixed(4)}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="Fuel_Price"
                      stroke="#ef4444"
                      name="Fuel Price"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="GDP_Growth_Rate"
                      stroke="#22c55e"
                      name="GDP Growth"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
