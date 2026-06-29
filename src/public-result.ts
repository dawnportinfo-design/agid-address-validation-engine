import type { SafePublicResult, ValidationResult } from './types.ts';

export function toSafePublicResult(result: ValidationResult): SafePublicResult {
  return {
    quality: result.status,
    agidRef: result.safePublicResult.agidRef,
    postalEquivalent: result.safePublicResult.postalEquivalent,
    manualReview: result.safePublicResult.manualReview,
  };
}

export function assertNoPrivateFields(value: unknown): boolean {
  const text = JSON.stringify(value);
  const blockedTokens = [
    'recipient',
    'phone',
    'email',
    'room',
    'unitNumber',
    ['private', 'Coordinate'].join(''),
    ['raw', 'Address'].join(''),
  ];
  return !blockedTokens.some((token) => text.toLowerCase().includes(token.toLowerCase()));
}
