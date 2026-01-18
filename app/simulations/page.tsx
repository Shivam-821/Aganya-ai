"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ConfirmationModal } from "@/components/ConfirmationModal";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SimulationsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchReports();
    }
  }, [isLoaded, isSignedIn]);

  const fetchReports = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setError("Failed to get authentication token");
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const res = await fetch(`${API_URL}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.status === 401) {
        // Redirect to login if unauthorized
        // window.location.href = "/login";
        setError("Unauthorized: Backend did not accept the session.");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setReports(data.data || []);
      } else {
        setError(data.error || "Failed to load reports");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Failed to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedReportId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReportId) return;
    setDeleteLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/reports/${selectedReportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== selectedReportId));
      } else {
        alert("Failed to delete simulation");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting simulation");
    } finally {
      setModalOpen(false);
      setSelectedReportId(null);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-muted-foreground/20 rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Simulations
          </h1>
          <p className="text-muted-foreground">
            Manage your demand forecasting projects
          </p>
        </div>
        <Link
          href="/simulations/new"
          className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          New Simulation
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl border-dashed">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No simulations yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first demand forecast simulation
          </p>
          <Link
            href="/simulations/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors font-medium shadow-sm"
          >
            Create Simulation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/simulations/${report.id}`}
              className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product info */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-8">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {report.input.product_name}
                    </h3>
                    <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mt-1 inline-block">
                      {report.input.category}
                    </span>
                  </div>

                  {/* Delete Action */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Simulation"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  {report.input.region} Region
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Forecast
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {report.output.forecast_sales}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      units
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Revenue
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(report.output.projected_revenue)}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                <span>{formatDate(report.created_at)}</span>
                <span className="flex items-center gap-1 font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Report
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Simulation?"
        message="This action cannot be undone. Are you sure you want to permanently delete this forecast?"
        confirmText="Delete"
        isDestructive={true}
        loading={deleteLoading}
      />
    </div>
  );
}
