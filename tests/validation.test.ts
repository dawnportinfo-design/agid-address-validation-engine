import assert from 'node:assert/strict';
import test from 'node:test';
import { assertNoPrivateFields, modelForCountry, toSafePublicResult, validateAddress } from '../src/index.ts';

test('validates strong postal-code country with complete synthetic components', () => {
  const result = validateAddress({
    purpose: 'delivery',
    countryModel: modelForCountry('JP', 'strong'),
    components: {
      countryCode: 'JP',
      administrativeArea: 'Tokyo',
      municipality: 'Chiyoda',
      postalCode: '100-0000',
      agidRef: 'AGID:JP:TEST:0001',
      sourceConfidence: 0.95,
    },
  });

  assert.equal(result.status, 'verified');
  assert.deepEqual(result.issues, []);
});

test('requires postal-equivalent zone for postal-code-missing countries', () => {
  const result = validateAddress({
    purpose: 'delivery',
    countryModel: modelForCountry('AE', 'missing'),
    components: {
      countryCode: 'AE',
      administrativeArea: 'synthetic-area',
      municipality: 'synthetic-city',
      sourceConfidence: 0.9,
    },
  });

  assert.equal(result.status, 'manual_required');
  assert.equal(result.issues[0].code, 'postal_equivalent.required');
});

test('accepts postal-equivalent zone for missing postal-code model', () => {
  const result = validateAddress({
    purpose: 'delivery',
    countryModel: modelForCountry('AE', 'missing'),
    components: {
      countryCode: 'AE',
      administrativeArea: 'synthetic-area',
      municipality: 'synthetic-city',
      postalEquivalentZone: 'PEZ:AE:0001',
      sourceConfidence: 0.9,
    },
  });

  assert.equal(result.status, 'verified');
  assert.equal(result.safePublicResult.postalEquivalent, true);
});

test('safe public result does not expose private-shaped fields', () => {
  const result = validateAddress({
    purpose: 'identity',
    countryModel: modelForCountry('US', 'strong'),
    components: {
      countryCode: 'US',
      administrativeArea: 'CA',
      municipality: 'synthetic-city',
      streetOrBlock: 'synthetic-block',
      postalCode: '00000',
      sourceConfidence: 0.8,
    },
  });

  assert.equal(assertNoPrivateFields(toSafePublicResult(result)), true);
});

test('invalid AGID reference requires manual review', () => {
  const result = validateAddress({
    purpose: 'delivery',
    countryModel: modelForCountry('JP', 'strong'),
    components: {
      countryCode: 'JP',
      administrativeArea: 'Tokyo',
      municipality: 'synthetic-city',
      postalCode: '100-0000',
      agidRef: 'bad',
      sourceConfidence: 0.9,
    },
  });

  assert.equal(result.status, 'manual_required');
  assert.equal(result.issues[0].code, 'agid.invalid_shape');
});

