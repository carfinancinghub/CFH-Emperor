// src/services/escrow/EscrowMockService.ts
export type EscrowStatus =
  | "CREATED"
  | "FUNDED"
  | "INSPECTION_PENDING"
  | "READY_TO_RELEASE"
  | "RELEASED"
  | "CANCELLED";

export type EscrowCondition = {
  id: string;
  description: string;
  proposedBy: "buyer" | "seller" | "escrow_officer";
  createdAt: string;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED";
};

export type EscrowTransaction = {
  id: string;
  title: string;
  buyerId: string;
  sellerId: string;
  amountUsd: number;
  status: EscrowStatus;
  createdAt: string;
  lastUpdatedAt: string;
  conditions: EscrowCondition[];
};

const nowIso = () => new Date().toISOString();

const seedTransactions: EscrowTransaction[] = [
  {
    id: "1001",
    title: "2018 Toyota Camry — Deal #1001",
    buyerId: "buyer_demo",
    sellerId: "seller_demo",
    amountUsd: 14500,
    status: "INSPECTION_PENDING",
    createdAt: nowIso(),
    lastUpdatedAt: nowIso(),
    conditions: [
      {
        id: "c1",
        description:
          "Vehicle must pass mechanic inspection with no major drivetrain issues; minor cosmetic issues acceptable.",
        proposedBy: "buyer",
        createdAt: nowIso(),
        status: "PROPOSED",
      },
    ],
  },
  {
    id: "1002",
    title: "2020 Honda Civic — Deal #1002",
    buyerId: "buyer_demo",
    sellerId: "seller_demo",
    amountUsd: 18900,
    status: "FUNDED",
    createdAt: nowIso(),
    lastUpdatedAt: nowIso(),
    conditions: [],
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const EscrowMockService = {
  async listTransactions(): Promise<EscrowTransaction[]> {
    await delay(150);
    return [...seedTransactions];
  },

  async getTransaction(id: string): Promise<EscrowTransaction | null> {
    await delay(120);
    return seedTransactions.find((t) => t.id === id) ?? null;
  },

  async proposeCondition(transactionId: string, description: string) {
    await delay(180);
    const tx = seedTransactions.find((t) => t.id === transactionId);
    if (!tx) throw new Error("Transaction not found");

    const cond: EscrowCondition = {
      id: `c_${Math.random().toString(16).slice(2)}`,
      description,
      proposedBy: "buyer",
      createdAt: nowIso(),
      status: "PROPOSED",
    };

    tx.conditions = [cond, ...tx.conditions];
    tx.lastUpdatedAt = nowIso();
    return { ok: true, condition: cond };
  },
};
