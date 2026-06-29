import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { modelForCountry, toSafePublicResult, validateAddress } from '../src/index.ts';

type ContractVector = {
  id: string;
  postal: {
    zoneId: string;
    countryCode: string;
    zoneState: 'postal_equivalent';
  };
  ai: {
    decision: 'allow';
    sourceBacked: boolean;
    amtState: 'verified';
  };
};

const contractFixturePath = '../agid-interoperability-contracts/fixtures/interop-vectors.json';
const localFixturePath = 'tests/fixtures/interop-vectors.json';
const fixturePath = fs.existsSync(contractFixturePath) ? contractFixturePath : localFixturePath;

const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
  vectors: ContractVector[];
};

test('validation engine accepts the shared no-postcode AGID postal-equivalent demo', () => {
  const vector = fixture.vectors.find((item) => item.id === 'no-postcode-agid-to-zk-demo');
  assert.ok(vector);

  const result = validateAddress({
    purpose: 'delivery',
    countryModel: modelForCountry(vector.postal.countryCode, 'missing'),
    components: {
      countryCode: vector.postal.countryCode,
      administrativeArea: 'AGID-DEMO-AREA',
      municipality: 'AGID-DEMO-MUNICIPALITY',
      postalEquivalentZone: vector.postal.zoneId,
      agidRef: 'AGID:AE:DEMO',
      sourceConfidence: 0.95,
    },
  });

  assert.equal(vector.postal.zoneState, 'postal_equivalent');
  assert.equal(vector.ai.decision, 'allow');
  assert.equal(result.status, 'verified');
  assert.deepEqual(toSafePublicResult(result), {
    quality: 'verified',
    agidRef: 'AGID:AE:DEMO',
    postalEquivalent: true,
    manualReview: false,
  });
});
