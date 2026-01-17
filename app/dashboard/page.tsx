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

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [categoryDist, setCategoryDist] = useState<any[]>([]);

  // Fetch Category Data
  useEffect(() => {
    fetch(`${API_URL}/dashboard/categories`)
      .then((res) => res.json())
      .then((data) => setCategoryDist(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const [selectedTrendCategory, setSelectedTrendCategory] = useState("All");

  // Form State
  const [formData, setFormData] = useState({
    product_name: "",
    category: "Fashion",
    region: "Tier-1",
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
    <div className="min-h-screen bg-background p-6 md:p-12 md:pt-5">
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
            className="px-6 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors flex items-center gap-2"
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

        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT: INPUT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              New Forecast
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Product Name
                </label>
                <input
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Banarasi Saree"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-70">
                    Region
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
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
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none"
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
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none"
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
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                {loading ? "Crunching Policy Data..." : "Run AI Forecast"}
              </button>
            </form>
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
                className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                  AI Prediction Results
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm opacity-60">Forecasted Sales</p>
                    <p className="text-4xl font-bold mt-1">
                      {result.forecast_sales}{" "}
                      <span className="text-sm font-normal opacity-50">
                        units
                      </span>
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl">
                    <p className="text-sm opacity-60">Revenue Potential</p>
                    <p className="text-4xl font-bold mt-1 text-green-500">
                      ₹{result.projected_revenue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* NEW: SENTIMENT & CONFIDENCE */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-border">
                    <p className="text-sm opacity-60 mb-1">Market Sentiment</p>
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
                  <div className="p-4 bg-muted/30 rounded-xl border border-dashed border-border">
                    <p className="text-sm opacity-60 mb-2">AI Confidence</p>
                    <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${result.confidence_score || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right font-mono opacity-70">
                      {result.confidence_score || 0}%
                    </p>
                  </div>
                </div>

                {/* RISK FLAGS */}
                <div className="mb-6">
                  <p className="text-sm font-bold opacity-70 mb-3 uppercase tracking-wider">
                    Risk Analysis
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.risk_flags.length > 0 ? (
                      result.risk_flags.map((flag: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-medium"
                        >
                          🚨 {flag}
                        </span>
                      ))
                    ) : (
                      <span className="text-green-500 text-sm">
                        ꪜ  Low Risk Detected
                      </span>
                    )}
                  </div>
                  {result.potential_waste_inr > 0 && (
                    <div className="mt-4 p-3 bg-red-900/10 border border-red-900/20 rounded-lg flex items-center gap-3">
                      <div className="font-bold text-red-600">
                        ₹{result.potential_waste_inr.toLocaleString()}
                      </div>
                      <div className="text-sm opacity-80">
                        Estimated waste if stock isn't cleared.
                      </div>
                    </div>
                  )}
                </div>

                {/* VISUALIZATION: FINANCIAL HEALTH */}
                <div className="mb-6 p-4 bg-muted/20 border border-border rounded-xl">
                  <p className="text-xs font-bold opacity-60 mb-4 uppercase tracking-wider">
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

                {/* POLICY IMPACT EXPLANATION */}
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
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
            className="md:col-span-2 bg-card border border-border rounded-2xl p-8 shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Market vs Policy Trends</h2>
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
          </motion.div>

          {/* 2. CATEGORY DISTRIBUTION (Span 1) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-xl flex flex-col"
          >
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
                            "#0088FE",
                            "#00C49F",
                            "#FFBB28",
                            "#FF8042",
                            "#0d9488",
                            "#ff7300",
                          ][index % 6]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 4. INFLATION AREA CHART (Span 4 - Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-xl"
          >
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
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="Month_Str" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <Tooltip
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
