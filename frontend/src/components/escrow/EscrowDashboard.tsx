/**
 * @file EscrowDashboard.tsx
 * @path C:\CFH\frontend\src\components\escrow\EscrowDashboard.tsx
 *
 * PURPOSE (Wave-23 Escrow Flow)
 * - Provide a central Escrow landing/dashboard that is functional even when backend escrow APIs are missing.
 * - Uses EscrowService which attempts real API and falls back to frontend mock data (EscrowMockService).
 *
 * NOTE (facts from current environment)
 * - Backend 3000 returns 404 for /api/escrow routes (no escrow endpoints yet).
 * - Therefore this dashboard must not hard-depend on /api/admin/escrow/summary.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";

import AdminLayout from "@/components/admin/layout/AdminLayout";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import EscrowSEOHead from "@/components/escrow/EscrowSEOHead";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { theme } from "@/styles/theme";

import { EscrowService } from "@/services/escrow/EscrowService";
import type { EscrowTransaction } from "@/services/escrow/EscrowMockService";

/* -------------------------------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------------------------------- */

type EscrowSummary = {
  totalTransactions: number;
  pendingClaims: number; // placeholder until backend claims API exists
  completedTransactions: number;
  successfulClaimsResolved: number; // placeholder until backend claims API exists
};

/* -------------------------------------------------------------------------------------------------
 * Helpers (pure, testable)
 * ------------------------------------------------------------------------------------------------- */

function buildSummary(transactions: EscrowTransaction[]): EscrowSummary {
  const totalTransactions = transactions.length;

  const completedTransactions = transactions.filter((t) => t.status === "RELEASED").length;

  // These are placeholders until backend endpoints exist. We keep the UI stable.
  const pendingClaims = 0;
  const successfulClaimsResolved = 0;

  return {
    totalTransactions,
    pendingClaims,
    completedTransactions,
    successfulClaimsResolved,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------------------------------- */

const EscrowDashboard: React.FC = () => {
  // -----------------------------
  // State
  // -----------------------------
  const [transactions, setTransactions] = React.useState<EscrowTransaction[]>([]);
  const [summary, setSummary] = React.useState<EscrowSummary>({
    totalTransactions: 0,
    pendingClaims: 0,
    completedTransactions: 0,
    successfulClaimsResolved: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // -----------------------------
  // Navigation
  // -----------------------------
  const navigate = useNavigate();

  const handleGoToMonitor = () => navigate("/escrow");
  const handleGoToClaims = () => navigate("/escrow"); // placeholder until claims page exists

  // -----------------------------
  // Data loading (mock-first via service)
  // -----------------------------
  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const rows = await EscrowService.listTransactions();
        const computed = buildSummary(rows);

        if (!mounted) return;
        setTransactions(rows);
        setSummary(computed);
      } catch (e: any) {
        if (!mounted) return;
        setError("❌ Failed to load escrow dashboard data (mock/service).");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <AdminLayout>
      <EscrowSEOHead
        title="Escrow Dashboard"
        description="View escrow activity and navigate escrow flows. Uses mock fallback until backend routes exist."
      />

      <ErrorBoundary>
        <div className={`${theme.spacingLg} space-y-8`}>
          {/* Header */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-indigo-700">🏛️ Escrow Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Backend escrow API is not available yet (404). This dashboard uses a safe mock fallback via EscrowService.
              </p>
            </div>

            <Link
              to="/escrow/officer"
              className={`${theme.primaryButton}`}
              aria-label="Navigate to Escrow Officer Dashboard to manage transactions"
            >
              Officer View
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <p className={`text-center ${theme.errorText} py-4`} role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">💵</p>
                  <p className="text-xl font-semibold">Total Transactions</p>
                  <p className="text-2xl font-bold">{summary.totalTransactions}</p>
                  <Button
                    onClick={handleGoToMonitor}
                    className={`${theme.primaryButton}`}
                    aria-label="Navigate to Escrow page to view transactions"
                  >
                    View Escrow
                  </Button>
                </Card>

                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">🛡️</p>
                  <p className="text-xl font-semibold">Pending Claims</p>
                  <p className="text-2xl font-bold">{summary.pendingClaims}</p>
                  <Button
                    onClick={handleGoToClaims}
                    className={`${theme.primaryButton}`}
                    aria-label="Navigate to Escrow Claims (placeholder)"
                  >
                    Claims (Placeholder)
                  </Button>
                </Card>
              </div>

              {/* Achievements (kept but now computed safely) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">🎉</p>
                  <p className="text-xl font-semibold">Completed Transactions</p>
                  <p className="text-2xl font-bold">{summary.completedTransactions}</p>
                  <p className={`${theme.fontSizeSm} text-gray-500`}>
                    Milestone: {summary.completedTransactions >= 100 ? "🏆 Veteran Escrow Officer" : "Keep going!"}
                  </p>
                </Card>

                <Card className={`flex flex-col items-center ${theme.spacingLg} space-y-4 hover:shadow-xl`}>
                  <p className="text-5xl">🛠️</p>
                  <p className="text-xl font-semibold">Claims Resolved</p>
                  <p className="text-2xl font-bold">{summary.successfulClaimsResolved}</p>
                  <p className={`${theme.fontSizeSm} text-gray-500`}>
                    Milestone: {summary.successfulClaimsResolved >= 50 ? "🏅 Expert Resolver" : "Waiting on backend API"}
                  </p>
                </Card>
              </div>

              {/* Transactions List (new, functional proof) */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Transactions</h2>

                {transactions.length === 0 ? (
                  <div className="text-sm text-gray-600">No escrow transactions available.</div>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((t) => (
                      <div key={t.id} className="border rounded p-3">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-sm opacity-80">
                          Status: {t.status} • Amount: ${t.amountUsd}
                        </div>

                        <div className="text-sm mt-2 flex gap-3 flex-wrap">
                          <Link className="underline" to={`/escrow/transaction/${t.id}`}>
                            Open transaction
                          </Link>
                          <span className="opacity-60">•</span>
                          <Link className="underline" to="/escrow/officer">
                            Officer view
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export { EscrowDashboard };
export default EscrowDashboard;

