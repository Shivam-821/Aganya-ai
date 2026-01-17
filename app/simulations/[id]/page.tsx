"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatPanel from "@/components/ChatPanel";
import { useAuth } from "@clerk/nextjs";

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

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  }, [reportId]);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-800 rounded w-1/3 mb-4" />
          <div className="h-4 bg-zinc-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-zinc-800 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-zinc-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
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
              <div className="text-sm text-muted-foreground mb-1">
                Potential Waste
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>
          </div>

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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
