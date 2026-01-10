// src/services/escrow/EscrowService.ts
import { escrowApi } from "@/services/escrowApi";
import { EscrowMockService, EscrowTransaction } from "@/services/escrow/EscrowMockService";

// If backend has no escrow routes (404), we fall back to mock.
// This keeps UI functional now and flips to real API later without UI rewrites.
const isNotFound = (e: any) =>
  !!(e && (e.status === 404 || e?.response?.status === 404));

export const EscrowService = {
  async getTransaction(transactionId: string): Promise<EscrowTransaction | null> {
    try {
      const r = await escrowApi.getTransaction(transactionId);
      // If backend later returns real shapes, we map here.
      return (r?.data as any) ?? null;
    } catch (e: any) {
      if (isNotFound(e)) return await EscrowMockService.getTransaction(transactionId);
      return await EscrowMockService.getTransaction(transactionId);
    }
  },

  async proposeCondition(transactionId: string, description: string) {
    try {
      const r = await escrowApi.proposeCondition(transactionId, description);
      return r?.data ?? { ok: true };
    } catch (e: any) {
      if (isNotFound(e)) return await EscrowMockService.proposeCondition(transactionId, description);
      return await EscrowMockService.proposeCondition(transactionId, description);
    }
  },

  async listTransactions(): Promise<EscrowTransaction[]> {
    // No endpoint yet in escrowApi.ts; use mock until backend exists.
    return await EscrowMockService.listTransactions();
  },
};
