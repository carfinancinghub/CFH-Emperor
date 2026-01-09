import React from "react";
import type { RoyaltyPayoutLine } from "./types";

export function RoyaltyLedgerTable(props: { rows: RoyaltyPayoutLine[] }): JSX.Element {
  const { rows } = props;

  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="font-semibold mb-2">Royalty Ledger</div>

      {rows.length === 0 ? (
        <div className="text-sm text-gray-600">No payouts yet.</div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Status</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Beneficiary</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">${(r.amountCents / 100).toFixed(2)}</td>
                  <td className="p-2">{r.beneficiaryUserId}</td>
                  <td className="p-2">{r.createdAtISO}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RoyaltyLedgerTable;
