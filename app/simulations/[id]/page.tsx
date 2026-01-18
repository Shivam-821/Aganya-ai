"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChatPanel from "@/components/ChatPanel";
import { useAuth, useUser } from "@clerk/nextjs";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import ExportButton from "@/components/ExportButton";
import { InfoTooltip } from "@/components/InfoTooltip";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Report {
  id: string;
  user_id: string;
  input: {
    product_name: string;
    category: string;
    region: string;
    unit_price: number;
    current_inventory: number;
    prediction_date: string;
    model_type?: string;
  };
  output: {
    forecast_sales: number;
    projected_revenue: number;
    potential_waste_inr: number;
    risk_flags: string[];
    policy_impact: {
      repo_rate_effect: string;
      inflation_effect: string;
    };
    explanation?: Record<string, number>;
  };
  created_at: string;
  modified_at: string | null;
}

interface ExpandedCards {
  [key: string]: boolean;
}

export default function SimulationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [expandedCards, setExpandedCards] = useState<ExpandedCards>({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!isLoaded || !isSignedIn) return;

        const token = await getToken();
        if (!token) {
          setError("Authentication failed");
          setLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const res = await fetch(`${API_URL}/reports/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await res.json();

        if (data.success) {
          setReport(data.data);
        } else {
          setError(data.error || "Failed to load report");
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request timed out. Please refresh the page.");
        } else {
          setError("Failed to connect to server");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, isLoaded, isSignedIn, getToken]);

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handlePredictionUpdate = (newPrediction: Report["output"]) => {
    if (report) {
      setReport({
        ...report,
        output: newPrediction,
        modified_at: new Date().toISOString(),
      });
    }
  };

  const handleSaveOverride = async (message: any) => {
    if (!report || !message.modifiedInput || !message.modifiedPrediction)
      return;

    try {
      setLoading(true);
      const token = await getToken();

      // Merge current inputs with overrides
      const updatedInput = {
        ...report.input,
        ...message.modifiedInput,
        // Ensure numbers are numbers
        unit_price: Number(
          message.modifiedInput.unit_price || report.input.unit_price,
        ),
        current_inventory: Number(
          message.modifiedInput.current_inventory ||
            report.input.current_inventory,
        ),
      };

      const res = await fetch(`${API_URL}/reports/${report.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedInput),
      });

      const data = await res.json();
      if (data.success) {
        setReport(data.data);
        setSuccessModalOpen(true);
        // alert("Simulation updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update simulation: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating simulation");
    } finally {
      setLoading(false);
    }
  };

  // Prepare Explanation Data
  const explanationData = report?.output.explanation
    ? Object.entries(report.output.explanation)
        .map(([key, value]) => ({
          feature: key,
          impact: value,
          formattedImpact: value.toFixed(4),
        }))
        .filter((item) => Math.abs(item.impact) > 0.01) // Filter negligible
        .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)) // Sort by magnitude
    : [];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium text-popover-foreground">{label}</p>
          <p
            className={`text-sm ${
              payload[0].value >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            Impact: {payload[0].value > 0 ? "+" : ""}
            {Number(payload[0].value).toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  const riskExplanations: Record<string, string> = {
    "High Waste Risk":
      "Current inventory significantly exceeds forecasted demand. Consider promotional pricing or reducing future orders to minimize dead stock losses.",
    "Diwali Demand Spike Active":
      "The prediction date falls within the Diwali shopping window (Dussehra to Diwali+3 days). Expect 20-40% higher demand than normal periods.",
    "Wedding Season Boost Active":
      "Wedding season months (Nov-Feb, May-Jun) typically see elevated demand for fashion and jewelry categories. Factor in a 15-30% boost.",
    "High Interest Rate Drag detected":
      "RBI Repo Rate above 6.25% creates financing headwinds for big-ticket items like automotive and home goods. Expect 10-20% demand reduction.",
  };

  const policyExplanations: Record<string, string> = {
    "High Interest Rates reduing Demand":
      "When RBI Repo Rate exceeds 6.25%, borrowing costs increase, reducing consumer spending on credit-dependent purchases.",
    "Low Interest Rates boosting Demand":
      "RBI Repo Rate below 6.0% makes credit cheaper, encouraging consumer spending especially on high-value items.",
    "High Inflation reducing Purchasing Power":
      "CPI above 6% erodes real income, causing consumers to prioritize essentials over discretionary spending.",
    Neutral:
      "Current policy conditions are within normal ranges and not significantly impacting demand patterns.",
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-400/60 rounded w-1/3 mb-4" />
          <div className="h-4 bg-zinc-400/60 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-zinc-400/60 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-zinc-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">
            Report not found
          </h3>
          <p className="text-muted-foreground mb-6">
            {error || "This report may have been deleted"}
          </p>
          <button
            onClick={() => router.push("/simulations")}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors"
          >
            Back to Simulations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/simulations")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {report.input.product_name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="px-2 py-0.5 bg-muted rounded">
                {report.input.category}
              </span>
              <span>{report.input.region}</span>
              <span>•</span>
              <span>
                Forecast for {formatDate(report.input.prediction_date)}
              </span>
              {report.modified_at && (
                <>
                  <span>•</span>
                  <span className="text-amber-400">Modified</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <ExportButton
          data={report}
          userName={user?.fullName || user?.firstName || "Aganya User"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Forecast Period Disclaimer */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-400 flex items-start gap-2">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
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
                <strong className="font-semibold">
                  Forecast Period Notice:
                </strong>{" "}
                This simulation forecasts demand for approximately 30 days
                around{" "}
                {new Date(report.input.prediction_date).toLocaleDateString(
                  "en-IN",
                  { month: "long", year: "numeric" },
                )}
                , using macro-economic indicators (Repo Rate, CPI, GDP)
                applicable to that period.
              </span>
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1">
                Forecast Sales
              </div>
              <div className="text-3xl font-bold text-foreground">
                {report.output.forecast_sales}
              </div>
              <div className="text-xs text-muted-foreground mt-1">units</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1">
                Projected Revenue
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {formatCurrency(report.output.projected_revenue)}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="text-sm text-muted-foreground mb-1 flex items-center">
                Potential Waste
                <InfoTooltip
                  title="Potential Waste (Holding Cost)"
                  description="This represents the estimated holding cost for excess inventory that may not sell. It's calculated as 20% of the total value of unsold units, accounting for storage, insurance, depreciation, and opportunity costs."
                  formula="Excess Units × Unit Price × 0.2 (20% holding cost)"
                />
              </div>
              <div
                className={`text-2xl font-bold ${
                  report.output.potential_waste_inr > 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {formatCurrency(report.output.potential_waste_inr)}
              </div>
            </div>
          </div>

          {/* Input Parameters */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-medium text-foreground mb-4">
              Input Parameters
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Unit Price
                </div>
                <div className="text-foreground font-medium">
                  {formatCurrency(report.input.unit_price)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Current Inventory
                </div>
                <div className="text-foreground font-medium">
                  {report.input.current_inventory} units
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Category
                </div>
                <div className="text-foreground font-medium">
                  {report.input.category}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Region</div>
                <div className="text-foreground font-medium">
                  {report.input.region}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Model Engine
                </div>
                <div className="text-foreground font-medium capitalize">
                  {report.input.model_type || "Advanced"}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Chart (If Available) */}
          {explanationData.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                What Drives this Forecast? (Explainable AI)
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={explanationData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="hsl(var(--border))"
                      opacity={0.5}
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      width={120}
                    />
                    <RechartsTooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                    />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                      {explanationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.impact >= 0 ? "#10b981" : "#f43f5e"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic border-t pt-2 border-border/50">
                * Shows how each factor positively (Green) or negatively (Red)
                contributes to the final demand value relative to the base
                trend.
              </p>
            </div>
          )}

          {/* Risk Flags - Expandable */}
          {report.output.risk_flags.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-medium text-foreground mb-4">
                Risk Analysis
              </h3>
              <div className="space-y-3">
                {report.output.risk_flags.map((flag, i) => (
                  <div
                    key={i}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCard(`risk-${i}`)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-red-500/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <span className="text-red-400 font-medium">{flag}</span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-zinc-500 transition-transform ${
                          expandedCards[`risk-${i}`] ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedCards[`risk-${i}`] && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground pl-11">
                          {riskExplanations[flag] ||
                            "This risk factor may impact your forecast. Consider adjusting your strategy accordingly."}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policy Impact - Expandable */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-medium text-foreground mb-4">Policy Impact</h3>
            <div className="space-y-3">
              {/* Repo Rate */}
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCard("repo")}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-teal-500/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-zinc-400 text-sm">
                        RBI Repo Rate Effect
                      </div>
                      <div className="text-teal-400 font-medium">
                        {report.output.policy_impact.repo_rate_effect}
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-zinc-500 transition-transform ${
                      expandedCards["repo"] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedCards["repo"] && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground pl-11">
                      {policyExplanations[
                        report.output.policy_impact.repo_rate_effect
                      ] || policyExplanations["Neutral"]}
                    </p>
                  </div>
                )}
              </div>

              {/* Inflation */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCard("inflation")}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-500/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-zinc-400 text-sm">
                        CPI Inflation Effect
                      </div>
                      <div className="text-amber-400 font-medium">
                        {report.output.policy_impact.inflation_effect}
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-zinc-500 transition-transform ${
                      expandedCards["inflation"] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedCards["inflation"] && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground pl-11">
                      {policyExplanations[
                        report.output.policy_impact.inflation_effect
                      ] || policyExplanations["Neutral"]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ChatPanel
              reportId={reportId}
              onPredictionUpdate={handlePredictionUpdate}
              onSaveOverride={handleSaveOverride}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onConfirm={() => setSuccessModalOpen(false)}
        title="Success"
        message="Simulation updated successfully!"
        confirmText="OK"
        showCancel={false}
      />
    </div>
  );
}
