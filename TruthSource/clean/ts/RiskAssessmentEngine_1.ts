// File: RiskAssessmentEngine.ts
// Path: backend/utils/RiskAssessmentEngine.ts
// Author: Cod5 (07212245, July 21, 2025, 22:45 PDT)
// Purpose: Predicts vehicle risk for insurers based on usage, history, and dispute outcomes, with Enterprise-tier dispute history and real-time updates

import axios from '@utils/axios';
import { logError } from '@utils/logger';
import { fetchVehicleHistory } from '@utils/vehicleUtils';
import { fetchDisputeHistory } from '@utils/disputeUtils';
import { subscribeToWebSocket } from '@lib/websocket';

// === Interfaces ===
interface VehicleData {
  vehicleId: string;
  mileage: number;
  age: number;
  accidentCount: number;
}

interface RiskAssessment {
  vehicleId: string;
  riskScore: 'Low' | 'Medium' | 'High';
  riskFactors: string[];
}

interface DisputeData {
  vehicleId: string;
  disputeCount: number;
  severity: 'Low' | 'Medium' | 'High';
}

interface DisputeOutcome {
  disputeId: string;
  outcome: string;
  voteCounts: { [vote: string]: number };
}

// === Risk Assessment Engine ===
export const analyzeVehicleRisk = async (vehicleData: VehicleData, isEnterprise: boolean = false): Promise<RiskAssessment> => {
  try {
    const { vehicleId, mileage, age, accidentCount } = vehicleData;
    let riskScore: 'Low' | 'Medium' | 'High' = 'Low';
    const riskFactors: string[] = [];

    // Basic risk assessment
    if (mileage > 100000) {
      riskScore = 'Medium';
      riskFactors.push('High mileage');
    }
    if (age > 7) {
      riskScore = riskScore === 'Medium' ? 'High' : 'Medium';
      riskFactors.push('Old vehicle');
    }
    if (accidentCount > 0) {
      riskScore = accidentCount > 1 ? 'High' : 'Medium';
      riskFactors.push(`${accidentCount} accident(s)`);
    }

    // Enterprise: Integrate dispute history and outcome
    if (isEnterprise) {
      const disputeData = await fetchDisputeHistory(vehicleId);
      const disputeOutcome = await fetchDisputeOutcome(vehicleId);
      const updatedAssessment = integrateDisputeHistory({ riskScore, riskFactors }, disputeData, disputeOutcome);
      riskScore = updatedAssessment.riskScore;
      riskFactors.push(...updatedAssessment.riskFactors);
    }

    return { vehicleId, riskScore, riskFactors };
  } catch (err) {
    logError(err);
    throw new Error('Failed to analyze vehicle risk.');
  }
};

// === Fetch Dispute Outcome (Enterprise) ===
export const fetchDisputeOutcome = async (vehicleId: string): Promise<DisputeOutcome> => {
  try {
    const response = await axios.get(`/api/disputes/${vehicleId}/outcome`);
    return response.data; // { disputeId, outcome, voteCounts }
  } catch (err) {
    logError(err);
    throw new Error('Failed to fetch dispute outcome.');
  }
};

// === Integrate Dispute History (Enterprise) ===
export const integrateDisputeHistory = (
  assessment: { riskScore: 'Low' | 'Medium' | 'High'; riskFactors: string[] },
  disputeData: DisputeData,
  disputeOutcome: DisputeOutcome = { disputeId: '', outcome: '', voteCounts: {} }
): { riskScore: 'Low' | 'Medium' | 'High'; riskFactors: string[] } => {
  const { riskScore, riskFactors } = assessment;
  let newRiskScore = riskScore;

  if (disputeData.disputeCount > 0) {
    newRiskScore = disputeData.severity === 'High' ? 'High' : 'Medium';
    riskFactors.push(`${disputeData.disputeCount} dispute(s) with ${disputeData.severity} severity`);
  }

  if (disputeOutcome.outcome && disputeOutcome.outcome !== 'undecided') {
    newRiskScore = disputeOutcome.outcome === 'resolved-against' ? 'High' : newRiskScore;
    riskFactors.push(`Dispute outcome: ${disputeOutcome.outcome}`);
  }

  return { riskScore: newRiskScore, riskFactors };
};

// === Subscribe to Real-Time Updates (Enterprise) ===
export const subscribeToRealTimeUpdates = (vehicleId: string, callback: (data: RiskAssessment) => void): (() => void) => {
  try {
    return subscribeToWebSocket(`risk-updates/${vehicleId}`, (data) => {
      callback(data);
    });
  } catch (err) {
    logError(err);
    throw new Error('Failed to subscribe to real-time risk updates.');
  }
};

// === TODOs and Suggestions ===
// - Add caching for dispute outcomes to reduce API calls.
// - Integrate with multi-language support for risk factor messages.
// - Enhance with real-time analytics dashboard for risk trends.