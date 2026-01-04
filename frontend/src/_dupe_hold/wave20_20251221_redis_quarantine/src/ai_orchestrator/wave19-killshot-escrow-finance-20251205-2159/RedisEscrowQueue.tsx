/**
 * RedisEscrowQueue — production adapter
 * - Activated only when CFH_REDIS_ESCROW=1
 * - Lazy-imports the "redis" client so dev/CI without the package stays happy.
 */
import type { IEscrowQueue, EscrowJob } from "./EscrowQueueService";

type RedisClient = {
  connect(): Promise<void>;
  quit(): Promise<void>;
  lPush(key: string, value: string): Promise<number>;
  rPop(key: string): Promise<string | null>;
  hSet(key: string, fields: Record<string, string>): Promise<number>;
  hGetAll(key: string): Promise<Record<string, string>>;
  del(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  get(key: string): Promise<string | null>;
};

function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export class RedisEscrowQueue implements IEscrowQueue {
  private client: RedisClient | null = null;
  private readonly url: string;
  private readonly ns = "escrow";
  private readonly qKey = "escrow:queue";
  private readonly processingKey = "escrow:processing";
  private readonly counters = {
    acked: "escrow:cnt:acked",
    failed: "escrow:cnt:failed",
  };

  constructor(url: string) {
    if (!url) throw new Error("REDIS_URL required when CFH_REDIS_ESCROW=1");
    this.url = url;
  }

  private async getClient(): Promise<RedisClient> {
    if (this.client) return this.client;

    // Lazy import to avoid hard dep in non-Redis environments
    const mod = await import("redis"); // node-redis v4
    // @ts-ignore types at runtime
    const client: RedisClient = mod.createClient({ url: this.url });
    // @ts-ignore
    client.on?.("error", (err: unknown) => console.error("Redis error:", err));
    await client.connect();
    this.client = client;
    return client;
  }

  async enqueue(payload: unknown): Promise<EscrowJob> {
    const c = await this.getClient();
    const job: EscrowJob = {
      id: cryptoRandomId(),
      createdAt: new Date().toISOString(),
      payload,
      attempts: 0,
      status: "queued",
    };
    const data = JSON.stringify(job);
    await c.lPush(this.qKey, data);
    return job;
  }

  async dequeue(): Promise<EscrowJob | null> {
    const c = await this.getClient();
    const raw = await c.rPop(this.qKey);
    if (!raw) return null;
    const job: EscrowJob = JSON.parse(raw);
    job.status = "processing";
    job.attempts += 1;
    await c.hSet(`${this.processingKey}:${job.id}`, {
      id: job.id,
      createdAt: job.createdAt,
      payload: JSON.stringify(job.payload ?? null),
      attempts: String(job.attempts),
      status: job.status,
    });
    return job;
  }

  async ack(id: string): Promise<void> {
    const c = await this.getClient();
    await c.del(`${this.processingKey}:${id}`);
    await c.incr(this.counters.acked);
  }

  async fail(id: string, reason: string): Promise<void> {
    const c = await this.getClient();
    const key = `${this.processingKey}:${id}`;
    const meta = await c.hGetAll(key);
    if (Object.keys(meta).length) {
      meta.status = "failed";
      meta.failReason = reason;
      await c.hSet(key, meta as Record<string, string>);
    }
    await c.incr(this.counters.failed);
    // (optional) keep failed hash for post-mortems; do not del()
  }

  async stats() {
    const c = await this.getClient();
    // queued = LLEN of queue; processing = count of hashes with prefix (approx by SCAN later if needed)
    // To keep this minimal and O(1): we only track counters + queue length.
    // You can add SCAN later for exact processing count.
    const queued = Number(await (c as any).lLen?.(this.qKey) ?? 0);
    const acked = Number((await c.get(this.counters.acked)) ?? 0);
    const failed = Number((await c.get(this.counters.failed)) ?? 0);
    return { queued, processing: 0, acked, failed };
  }
}