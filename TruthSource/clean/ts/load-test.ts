// Converted from load-test.js — 2025-08-22T11:57:34.948195+00:00
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/notifications',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

const requests = 100;
let completed = 0;

for (let i = 0; i < requests; i++) {
  const req = http.request(options, (res) => {
    const start = Date.now();
    res.on('end', () => {
      console.log(`Request ${i + 1} took ${Date.now() - start}ms`);
      completed++;
      if (completed === requests) {
        console.log('Load test completed');
      }
    });
  });
  req.write(JSON.stringify({ userId: 'user1', message: 'Test', eventType: 'AUCTION_OUTBID' }));
  req.end();
}
