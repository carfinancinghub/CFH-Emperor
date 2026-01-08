export type Listing = {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  currency?: string;
  status?: 'draft' | 'published' | 'sold' | 'archived';
  sellerId: string;
};

export type Bid = {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
};

const mockListings: Listing[] = [
  { id: 'L-100', title: '2018 Honda Civic', description: 'Clean title, low miles', price: 13900, currency: 'USD', status: 'published', sellerId: 'S-1' },
  { id: 'L-200', title: '2016 Toyota Camry', description: 'Great condition', price: 12900, currency: 'USD', status: 'published', sellerId: 'S-2' },
];

export async function searchListings(q: string): Promise<Listing[]> {
  const term = (q ?? '').toLowerCase().trim();
  if (!term) return mockListings;
  return mockListings.filter(x => (x.title + ' ' + x.description).toLowerCase().includes(term));
}

export async function getListing(listingId: string): Promise<Listing | null> {
  return mockListings.find(x => x.id === listingId) ?? null;
}
