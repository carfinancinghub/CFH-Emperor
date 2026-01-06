import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Gauge } from "lucide-react";

import { api } from "@services/api";
import logger from "@utils/logger";
import { PremiumGate } from "@components/common";

export interface BidConfidenceMeterProps {
  auctionId: string;
  bidAmount: number;
  isPremium?: boolean;
}

type BasicPredictionResponse = {
  data?: {
    data?: {
      prediction?: {
        successProbability?: number; // 0..1
      };
    };
  };
};

type PremiumAdviceResponse = {
  data?: {
    data?: {
      advice?: string;
      recommendation?: string;
      reason?: string;
    };
  };
};

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function BidConfidenceMeter(props: BidConfidenceMeterProps) {
  const { auctionId, bidAmount, isPremium = false } = props;

  const [confidence, setConfidence] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const percentage = useMemo(() => {
    const v = confidence == null ? 0 : clamp01(confidence);
    return Math.round(v * 100);
  }, [confidence]);

  const fetchConfidence = useCallback(async () => {
    if (!auctionId || typeof bidAmount !== "number") return;

    setLoading(true);
    try {
      const response = await api.get<BasicPredictionResponse>("/api/predictions/basic", {
        params: { auctionId, bidAmount },
      });

      const p = response?.data?.data?.data?.prediction?.successProbability;
      const next = typeof p === "number" ? clamp01(p) : null;

      setConfidence(next);
      setError(null);
    } catch (err: any) {
      logger.error(`Failed to fetch confidence for auction ${auctionId}`, err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load confidence data";
      setError(String(msg));
      setConfidence(null);
    } finally {
      setLoading(false);
    }
  }, [auctionId, bidAmount]);

  const fetchAdvice = useCallback(async () => {
    if (!auctionId || typeof bidAmount !== "number") return;

    setLoading(true);
    try {
      // If your backend uses a different route, change it here.
      // This is the typical premium companion endpoint to /basic.
      const response = await api.get<PremiumAdviceResponse>("/api/predictions/advice", {
        params: { auctionId, bidAmount },
      });

      const d = response?.data?.data?.data;
      const text =
        (d?.advice && String(d.advice)) ||
        (d?.recommendation && String(d.recommendation)) ||
        (d?.reason && String(d.reason)) ||
        null;

      setAdvice(text);
      setError(null);
    } catch (err: any) {
      logger.error(`Failed to fetch premium advice for auction ${auctionId}`, err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load premium advice";
      setError(String(msg));
      setAdvice(null);
    } finally {
      setLoading(false);
    }
  }, [auctionId, bidAmount]);

  useEffect(() => {
    void fetchConfidence();
    // Reset advice when inputs change so we don’t show stale premium copy
    setAdvice(null);
  }, [fetchConfidence, auctionId, bidAmount]);

  const handleRefresh = () => {
    void fetchConfidence();
  };

  const handleLoadAdvice = () => {
    void fetchAdvice();
  };

  return (
    <div className="cfh-meter">
      <div className="cfh-meter-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Gauge size={18} />
        <h3 style={{ margin: 0, flex: 1 }}>Bid Confidence</h3>
        <span>{confidence == null ? "—" : `${percentage}%`}</span>
      </div>

      <div className="cfh-meter-track" style={{ marginTop: 8 }}>
        <div className="cfh-meter-fill" style={{ width: `${percentage}%` }} />
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
        <button type="button" onClick={handleRefresh} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>

        <PremiumGate isPremium={isPremium}>
          <button type="button" onClick={handleLoadAdvice} disabled={loading}>
            {advice ? "Refresh Premium Advice" : "Get Premium Advice"}
          </button>
        </PremiumGate>
      </div>

      {error && (
        <div style={{ marginTop: 10 }}>
          <small style={{ display: "block" }}>{error}</small>
        </div>
      )}

      {advice && (
        <div style={{ marginTop: 10 }}>
          <strong>Premium Insight</strong>
          <div>{advice}</div>
        </div>
      )}
    </div>
  );
}
