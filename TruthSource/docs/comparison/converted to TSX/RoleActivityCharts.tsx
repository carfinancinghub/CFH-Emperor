// ----------------------------------------------------------------------
// File: RoleActivityCharts.tsx
// Path: frontend/src/components/analytics/RoleActivityCharts.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A high-level component that fetches and dispatches analytics data to the
// appropriate, role-specific chart components.
//
// @usage
// Import and render this component, passing the desired 'role' as a prop.
// e.g., `<RoleActivityCharts role="lender" />`
//
// @architectural_notes
// - **Data Fetching Decoupling**: All API logic is handled by the `useRoleAnalytics` hook.
// - **Data Transformation Separation**: Raw API data is transformed into chart-ready
//   configs by dedicated mapper functions (e.g., `transformLenderData`). This separates
//   data shaping from rendering.
// - **Composition over Conditionals**: Instead of one large render method with many
//   `if` statements, this component renders specific child components
//   (e.g., `<LenderCharts />`) for each role. This is our standard for modular UI.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import LoadingSpinner from '@/components/common/LoadingSpinner';

ChartJS.register(...registerables);

// --- Type Definitions ---
type Role = 'lender' | 'mechanic' | 'judge';
interface LenderData { totalBids: number; successRate: number; avgInterest: number; months: string[]; bidsPerMonth: number[]; }
interface MechanicData { completed: number; pending: number; }
// ... other role data interfaces

// --- ARCHITECTURAL UPGRADE: Decoupled Data Hook ---
const useRoleAnalytics = (role: Role) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const roleRouteMap: Record<Role, string> = {
      lender: '/api/analytics/lender',
      mechanic: '/api/analytics/mechanic',
      judge: '/api/analytics/judge',
    };
    axios.get(roleRouteMap[role])
      .then(res => setData(res.data))
      .catch(() => setError(`Failed to fetch analytics for ${role}.`))
      .finally(() => setLoading(false));
  }, [role]);

  return { data, loading, error };
};

// --- ARCHITECTURAL UPGRADE: Separated Data Transformers ---
const commonOptions = { responsive: true, plugins: { legend: { display: true } } };

const transformLenderData = (data: LenderData) => ({
  barChart: {
    options: commonOptions,
    data: {
      labels: ['Total Bids', 'Success Rate %', 'Avg Interest %'],
      datasets: [{ label: 'Lender Stats', data: [data.totalBids, data.successRate, data.avgInterest], backgroundColor: '#4e79a7' }],
    },
  },
  lineChart: {
    options: commonOptions,
    data: {
      labels: data.months,
      datasets: [{ label: 'Bids Over Time', data: data.bidsPerMonth, borderColor: '#f28e2c' }],
    },
  },
});

const transformMechanicData = (data: MechanicData) => ({
    pieChart: {
        options: commonOptions,
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{ data: [data.completed, data.pending], backgroundColor: ['#59a14f', '#e15759'] }],
        },
    }
});

// --- ARCHITECTURAL UPGRADE: Composed Child Components ---
const LenderCharts: React.FC<{ data: LenderData }> = ({ data }) => {
  const chartConfigs = transformLenderData(data);
  return (
    <div className="space-y-4">
      <Bar options={chartConfigs.barChart.options} data={chartConfigs.barChart.data} />
      <Line options={chartConfigs.lineChart.options} data={chartConfigs.lineChart.data} />
    </div>
  );
};

const MechanicCharts: React.FC<{ data: MechanicData }> = ({ data }) => {
  const chartConfigs = transformMechanicData(data);
  return <Pie options={chartConfigs.pieChart.options} data={chartConfigs.pieChart.data} />;
};

// --- Main Component (Container/Dispatcher) ---
const RoleActivityCharts: React.FC<{ role: Role }> = ({ role }) => {
  const { data, loading, error } = useRoleAnalytics(role);

  if (loading) return <div className="text-center p-4">📈 Loading charts...</div>;
  if (error || !data) return <div className="text-red-500 text-center p-4">{error || `No data for ${role}`}</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">📊 {role.charAt(0).toUpperCase() + role.slice(1)} Activity Overview</h2>
      {role === 'lender' && <LenderCharts data={data} />}
      {role === 'mechanic' && <MechanicCharts data={data} />}
      {/* ... other roles would have their own components ... */}
    </div>
  );
};

export default RoleActivityCharts;