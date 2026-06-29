const fs = require('node:fs');

const schema = JSON.parse(fs.readFileSync('specs/validation-result.schema.json', 'utf8'));
if (schema.title !== 'AGID Address Validation Result') {
  throw new Error('Unexpected validation result schema title.');
}
if (!schema.properties?.safePublicResult) {
  throw new Error('Validation schema must define safePublicResult.');
}
console.log('Verified validation result schema.');

