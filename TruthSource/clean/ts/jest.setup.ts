// Converted from jest.setup.js — 2025-08-22T01:45:33.556980+00:00
const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  '@services': `${__dirname}/services`,
  '@utils': `${__dirname}/utils`,
  '@validation': `${__dirname}/validation`,
  '@repositories': `${__dirname}/repositories`
});
