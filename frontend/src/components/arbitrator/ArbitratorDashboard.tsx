// @ai-generated via ai-orchestrator
This file has been converted to TypeScript (TSX). We define necessary interfaces for props and data structures (`Dispute`, `Vote`, `AnalyticsData`) and apply explicit types to state variables and function parameters, ensuring type safety without altering the component's runtime behavior.

### `ArbitratorDashboard.tsx`

// 👑 Crown Certified Component — ArbitratorDashboard.tsx
// Path: frontend/src/components/arbitrator/ArbitratorDashboard.tsx
// Purpose: Enhanced dashboard for arbitrators with live voting, countdowns, AI suggestions, analytics, and urgency indicator.
// Author: Rivers Auction Team — May 16, 2025
// Updated: Added Navbar, Search Functionality, and Merged Arbitration Stats

import React, { useEffect, useState } from 'react';
import DisputeService from '@/services/disputes/DisputeService';
import AnalyticsDashboard from '@/components/common/AnalyticsDashboard';
import Navbar from '@/components/common/Navbar';
import Input from '@/components/common/Input';
import logger from '@/utils/logger';
import { Timer } from 'lucide-react';

// NOTE: SEOHead was in the original import statement but not used in the render. Keeping the import clean.
// import SEOHead from '@components/common/SEOHead'; 


// --- Type Definitions ---

interface Vote {
  arbitratorId: string;
  vote: string; // e.g., 'Yes', 'No', 'Neutral'
}

interface Dispute {
  _id: string;
  votingEndsAt: string; // ISO date string
  reason: string;
  status: string;
  votes?: Vote[];
  aiRecommendation?: string; // Only present if isPremium is true
}

type CountdownMap = Record<string, string>;

type AnalyticsData = Record<string, unknown> | null;

interface ArbitratorDashboardProps {
  arbitratorId: string;
  isPremium: boolean;
}

const ArbitratorDashboard: React.FC<ArbitratorDashboardProps> = ({ arbitratorId, isPremium }) => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [countdownMap, setCountdownMap] = useState<CountdownMap>({});
  const [analytics, setAnalytics] = useState<AnalyticsData>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingDisputes, setLoadingDisputes] = useState<boolean>(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchDisputes();
    if (isPremium) fetchAnalytics();
  }, [arbitratorId, isPremium]);

  const fetchDisputes = async (): Promise<void> => {
    setLoadingDisputes(true);
    try {
      // Type assertion for service response data
      const data: Dispute[] = (await DisputeService.getAssignedDisputes(arbitratorId)) || [];
      setDisputes(data);
      setFilteredDisputes(data);
    } catch (err) {
      logger.error('Error fetching disputes for arbitrator', err);
      setError('❌ Unable to load disputes');
    } finally {
      setLoadingDisputes(false);
    }
  };

  const fetchAnalytics = async (): Promise<void> => {
    setLoadingAnalytics(true);
    try {
      const data: AnalyticsData = (await DisputeService.getArbitratorAnalytics(arbitratorId)) || {};
      setAnalytics(data);
    } catch (err) {
      logger.error('Error fetching arbitrator analytics', err);
      setError('⚠️ Analytics unavailable');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns: CountdownMap = {};
      disputes.forEach((d) => {
        const end = new Date(d.votingEndsAt).getTime();
        const now = new Date().getTime();
        const diff = end - now;
        updatedCountdowns[d._id] = diff > 0 ? formatCountdown(diff) : 'Voting closed';
      });
      setCountdownMap(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [disputes]);

  const formatCountdown = (ms: number): string => {
    if (ms < 0) return 'Closed';
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}m ${s}s`;
  };

  const summarizeVotes = (votes: Vote[] = []): string => {
    const tally: Record<string, number> = { yes: 0, no: 0, neutral: 0 };
    votes.forEach((v) => {
      const key = v.vote?.toLowerCase();
      if (key && tally[key] !== undefined) tally[key]++;
    });
    return `✅ ${tally.yes} | ❌ ${tally.no} | ⚖️ ${tally.neutral}`;
  };

  const isUrgent = (dispute: Dispute): boolean => {
    const timeLeftMs = new Date(dispute.votingEndsAt).getTime() - Date.now();
    return timeLeftMs > 0 && timeLeftMs <= 180000; // less than or equal to 3 minutes
  };

  const handleVote = async (disputeId: string, vote: string): Promise<void> => {
    try {
      await DisputeService.castVote(disputeId, arbitratorId, vote);
      fetchDisputes(); // Refresh data
    } catch (err) {
      logger.error('Error casting vote', err);
      setError('❌ Failed to submit vote');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.target.value.toLowerCase();
    setSearchQuery(val);
    
    const filtered = disputes.filter((d) =>
      d._id?.toLowerCase().includes(val) ||
      d.reason?.toLowerCase().includes(val) ||
      d.status?.toLowerCase().includes(val)
    );
    setFilteredDisputes(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 space-y-6">
        {/* Note: If SEOHead was required, it would be placed here, but it's not rendered in the original JSX. */}
        <h2 className="text-2xl font-bold mb-4">⚖️ Arbitrator Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Input
          type="text"
          placeholder="Search by dispute ID, reason, or status..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2"
        />

        {loadingDisputes ? (
          <p className="italic text-gray-600">Loading assigned disputes...</p>
        ) : filteredDisputes.length === 0 ? (
          <p className="text-gray-600">No disputes assigned.</p>
        ) : (
          <div className="space-y-6">
            {filteredDisputes.map((dispute) => {
              // Ensure votes is treated as an array for safety
              const votes = dispute.votes || [];
              const voted = votes.some(v => v.arbitratorId === arbitratorId);
              const countdown = countdownMap[dispute._id] || '...';
              const urgent = isUrgent(dispute);

              return (
                <div
                  key={dispute._id}
                  className={`bg-white p-4 shadow rounded-lg border relative ${
                    urgent ? 'border-red-600' : 'border-gray-200'
                  }`}
                >
                  {urgent && (
                    <div
                      data-testid={`urgency-badge-${dispute._id}`}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow"
                    >
                      ⏳ Urgent
                    </div>
                  )}
                  <h3 className="font-semibold text-lg mb-1">🧾 Dispute: {dispute._id}</h3>
                  <p><strong>Status:</strong> {dispute.status}</p>
                  <p><strong>Reason:</strong> {dispute.reason}</p>
                  <p>
                    <strong>🕒 Time Left:</strong> 
                    <span className="inline-flex items-center">
                      <Timer className="w-4 h-4 mr-1" /> {countdown}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600">📊 Tally: {summarizeVotes(votes)}</p>

                  {voted ? (
                    <p className="mt-2 text-green-600 font-medium">✅ You have already voted</p>
                  ) : (
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => handleVote(dispute._id, 'Yes')} 
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Vote Yes ✅
                      </button>
                      <button 
                        onClick={() => handleVote(dispute._id, 'No')} 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Vote No ❌
                      </button>
                      <button 
                        onClick={() => handleVote(dispute._id, 'Neutral')} 
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Abstain ⚖️
                      </button>
                    </div>
                  )}

                  {isPremium && dispute.aiRecommendation && (
                    <div className="mt-3 text-sm italic text-blue-600">
                      💡 AI Suggests: <strong>{dispute.aiRecommendation}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">📈 Resolution Analytics</h3>
          {loadingAnalytics ? (
            <p className="italic text-gray-500">Loading performance analytics...</p>
          ) : (
            <>
              {isPremium ? (
                // AnalyticsDashboard expects data to be passed if isPremium
                <AnalyticsDashboard
                  data={analytics || {}} 
                  analyticsType="arbitrator-performance"
                  userRole="arbitrator"
                />
              ) : (
                <div className="bg-white p-4 shadow rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Basic Arbitration Stats</h4>
                  <ul className="text-sm list-disc ml-5 text-gray-700">
                    <li>Average Resolution Time: 3.2 hrs</li>
                    <li>Win Rate: 87%</li>
                    <li>Escalation Avoidance Rate: 91%</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArbitratorDashboard;