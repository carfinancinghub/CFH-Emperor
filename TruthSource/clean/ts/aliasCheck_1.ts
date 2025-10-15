// Converted from aliasCheck.js — 2025-08-22T01:45:31.529941+00:00
// tools/aliasCheck.js
require('module-alias/register');

try {
  const test = require('@controllers/lender/LenderTermsExporter');
  console.log('✅ SUCCESS: Alias worked — LenderTermsExporter loaded.');
} catch (err) {
  console.error('❌ ERROR: Alias failed to resolve.');
  console.error(err.message);
}
