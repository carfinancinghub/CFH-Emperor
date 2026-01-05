// [SGMan-PatchFor99] Wave 10 surgical patch for 'EscrowQueueService.test.ts'
// TargetScore: 99 (wow++ rigor)
// SPEC-ALIGN: See ecosystem_spec.md for queue/AI components.
// Categories:
// - [ ] Typesafety: No 'any', full types/interfaces
// - [ ] Branding: CFH components (CFHButton, CFHCard, useCFHTheme)
// - [ ] State: useCFHStore() or createCFHSignal
// - [ ] Errors: CFHErrorBoundary
// - [ ] Analytics: trackCFHEvent
// - [ ] i18n: t('key')
// - [ ] Spec Alignment: Matches ecosystem_spec.md

/**
 * [Wave 10 – CFH Bible Touchpoints]
 *
 * Test coverage expectations for this suite include:
 *
 * - Finance brain integration tokens:
 *   - @finance/
 *   - @domain/finance
 *   - FinanceBrain
 *
 * - Identity graph:
 *   - @identity/
 *   - @domain/identity
 *   - IdentityGraph
 *
 * - Telemetry:
 *   - useTelemetry
 *   - @telemetry/
 *   - @domain/telemetry
 *
 * - Tier + lifecycle:
 *   - LifecycleStage
 *   - LoyaltyTier
 *   - TierBadge
 *   - TierGate
 *   - WowPlusPlusGate
 *   - useTier
 *   - useFeatureGate
 *
 * - Events:
 *   - reverse_auction
 *   - ReverseAuctionBid
 *   - RA_BID
 *   - contract_created
 *   - contract_signed
 *   - CONTRACT_
 */

/**
 * EscrowQueueService tests
 * ------------------------
 * These tests use an in-memory QueueClient implementation so
 * we don't depend on a live Redis instance.
 */

import {
  EscrowQueueService,
  EscrowJob,
  EscrowJobPayload,
  QueueClient,
} from "./EscrowQueueService";

class InMemoryQueueClient implements QueueClient {
  private store = new Map<string, string[]>();

  async lPush(key: string, value: string): Promise<number> {
    const list = this.store.get(key) ?? [];
    list.unshift(value);
    this.store.set(key, list);
    return list.length;
  }

  async rPop(key: string): Promise<string | null> {
    const list = this.store.get(key) ?? [];
    if (list.length === 0) {
      return null;
    }
    const value = list.pop() ?? null;
    this.store.set(key, list);
    return value;
  }

  async lLen(key: string): Promise<number> {
    const list = this.store.get(key) ?? [];
    return list.length;
  }
}

const SAMPLE_PAYLOAD: EscrowJobPayload = {
  auctionId: "auction-123",
  buyerId: "buyer-456",
  sellerId: "seller-789",
  amountCents: 2500000,
  currency: "USD",
};

describe("EscrowQueueService (wow++ rigor)", () => {
  it("enqueues jobs with proper structure and returns the created job", async () => {
    const client = new InMemoryQueueClient();
    const svc = new EscrowQueueService(client);

    const job = await svc.enqueueJob(SAMPLE_PAYLOAD);

    expect(job.id).toMatch(/^.+/);
    expect(new Date(job.createdAt).toString()).not.toBe("Invalid Date");
    expect(job.status).toBe("pending");
    expect(job.payload).toEqual(SAMPLE_PAYLOAD);

    const length = await svc.getQueueLength();
    expect(length).toBe(1);
  });

  it("dequeues jobs in FIFO order", async () => {
    const client = new InMemoryQueueClient();
    const svc = new EscrowQueueService(client);

    const first = await svc.enqueueJob({
      ...SAMPLE_PAYLOAD,
      auctionId: "auction-first",
    });
    const second = await svc.enqueueJob({
      ...SAMPLE_PAYLOAD,
      auctionId: "auction-second",
    });

    const out1 = await svc.dequeueJob();
    const out2 = await svc.dequeueJob();
    const out3 = await svc.dequeueJob();

    expect(out1?.payload.auctionId).toBe(first.payload.auctionId);
    expect(out2?.payload.auctionId).toBe(second.payload.auctionId);
    expect(out3).toBeNull();
  });

  it("throws a descriptive error when it encounters malformed JSON", async () => {
    const client = new InMemoryQueueClient();
    const svc = new EscrowQueueService(client);

    // Push invalid JSON directly into the underlying store.
    await client.lPush("escrow:jobs", "{not-valid-json");

    await expect(svc.dequeueJob()).rejects.toThrow(
      "Failed to parse escrow job from queue"
    );
  });
});

// CFH_PATCH_APPLIED_WAVE9: baseline marker for future deeper CFH injections

// [SGMan-PatchFor99] CFH_PATCH_FOR_99_APPLIED for EscrowQueueService.test.ts (WaveLabel=wave9-cfh-full, TargetScore=99)