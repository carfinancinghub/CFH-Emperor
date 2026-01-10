export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  sellerId: string;
  status: "active" | "sold" | "draft";
};

export type Bid = {
  id: string;
  listingId: string;
  bidderId: string;
  amount: number;
  currency: string;
  createdAt: string;
  status: "active" | "accepted" | "rejected";
};

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "L-100",
    title: "2016 Honda Civic LX",
    description: "Clean title, 92k miles, well maintained.",
    price: 13900,
    currency: "USD",
    sellerId: "S-1",
    status: "active",
  },
  {
    id: "L-101",
    title: "2018 Toyota Camry SE",
    description: "One owner, service records included.",
    price: 18950,
    currency: "USD",
    sellerId: "S-2",
    status: "active",
  },
];

const SAMPLE_BIDS: Bid[] = [
  {
    id: "BID-1",
    listingId: "L-100",
    bidderId: "B-1",
    amount: 13900,
    currency: "USD",
    createdAt: new Date().toISOString(),
    status: "accepted",
  },
  {
    id: "BID-2",
    listingId: "L-101",
    bidderId: "B-3",
    amount: 18500,
    currency: "USD",
    createdAt: new Date().toISOString(),
    status: "active",
  },
];

// Minimal mock search
export async function searchListings(query: string): Promise<Listing[]> {
  const q = (query ?? "").trim().toLowerCase();
  const filtered = !q
    ? SAMPLE_LISTINGS
    : SAMPLE_LISTINGS.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.description.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q)
      );
  return Promise.resolve(filtered);
}

export async function getListingById(listingId: string): Promise<Listing | null> {
  const hit = SAMPLE_LISTINGS.find((x) => x.id === listingId) ?? null;
  return Promise.resolve(hit);
}

// Back-compat alias for pages that import `getListing`
export async function getListing(listingId: string): Promise<Listing | null> {
  return getListingById(listingId);
}

export async function listBidsForListing(listingId: string): Promise<Bid[]> {
  return Promise.resolve(SAMPLE_BIDS.filter((b) => b.listingId === listingId));
}

export async function placeBid(input: {
  listingId: string;
  bidderId: string;
  amount: number;
  currency: string;
}): Promise<Bid> {
  const bid: Bid = {
    id: `BID-${Math.floor(Math.random() * 100000)}`,
    listingId: input.listingId,
    bidderId: input.bidderId,
    amount: input.amount,
    currency: input.currency,
    createdAt: new Date().toISOString(),
    status: "active",
  };
  SAMPLE_BIDS.unshift(bid);
  return Promise.resolve(bid);
}
