import type {
  AddressComponents,
  CountryValidationModel,
  ValidationInput,
  ValidationIssue,
  ValidationResult,
  ValidationStatus,
} from './types.ts';

function hasValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCountryModel(input: ValidationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const country = input.components.countryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(country)) {
    issues.push({
      code: 'country.invalid',
      severity: 'blocked',
      message: 'Country code must be ISO 3166-1 alpha-2 shaped.',
    });
  }

  if (country !== input.countryModel.countryCode.toUpperCase()) {
    issues.push({
      code: 'country.model_mismatch',
      severity: 'error',
      message: 'Input country does not match the selected country model.',
    });
  }

  return issues;
}

export function validateRequiredFields(input: ValidationInput): ValidationIssue[] {
  const required =
    input.purpose === 'identity'
      ? input.countryModel.requiredForIdentity
      : input.countryModel.requiredForDelivery;

  return required
    .filter((field) => !hasValue(input.components[field]))
    .map((field) => ({
      code: `field.missing.${String(field)}`,
      severity: 'error' as const,
      message: `Required field is missing for ${input.purpose}.`,
    }));
}

export function validatePostalPolicy(input: ValidationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const hasPostalCode = hasValue(input.components.postalCode);
  const hasPostalEquivalent = hasValue(input.components.postalEquivalentZone);

  if (input.countryModel.postalCodeStrength === 'strong' && !hasPostalCode) {
    issues.push({
      code: 'postal.required',
      severity: 'error',
      message: 'A strong postal-code country requires a postal code or verified exception.',
    });
  }

  if (input.countryModel.postalCodeStrength === 'missing' && !hasPostalEquivalent) {
    issues.push({
      code: 'postal_equivalent.required',
      severity: 'error',
      message: 'A postal-code-missing country requires a postal-equivalent zone.',
    });
  }

  if (hasPostalEquivalent && !input.countryModel.acceptsPostalEquivalent) {
    issues.push({
      code: 'postal_equivalent.not_accepted',
      severity: 'warning',
      message: 'The selected country model does not normally accept postal-equivalent zones.',
    });
  }

  return issues;
}

export function validateAgidReferences(components: AddressComponents): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (hasValue(components.agidRef) && !/^AGID:[A-Z0-9:_-]{4,}$/i.test(components.agidRef ?? '')) {
    issues.push({
      code: 'agid.invalid_shape',
      severity: 'error',
      message: 'AGID reference shape is invalid.',
    });
  }
  if (hasValue(components.aoidRef) && !/^AOID:[A-Z0-9:_-]{4,}$/i.test(components.aoidRef ?? '')) {
    issues.push({
      code: 'aoid.invalid_shape',
      severity: 'error',
      message: 'AOID reference shape is invalid.',
    });
  }
  return issues;
}

export function decideStatus(issues: ValidationIssue[], sourceConfidence = 0): ValidationStatus {
  if (issues.some((issue) => issue.severity === 'blocked')) {
    return 'rejected';
  }
  if (issues.some((issue) => issue.severity === 'error')) {
    return 'manual_required';
  }
  if (issues.some((issue) => issue.severity === 'warning') || sourceConfidence < 0.75) {
    return 'partial';
  }
  return 'verified';
}

export function validateAddress(input: ValidationInput): ValidationResult {
  const issues = [
    ...validateCountryModel(input),
    ...validateRequiredFields(input),
    ...validatePostalPolicy(input),
    ...validateAgidReferences(input.components),
  ];
  const status = decideStatus(issues, input.components.sourceConfidence ?? 0);

  return {
    schemaVersion: 'address-validation-result-v0.1',
    status,
    issues,
    safePublicResult: {
      quality: status,
      agidRef: input.components.agidRef,
      postalEquivalent: hasValue(input.components.postalEquivalentZone),
      manualReview: status === 'manual_required' || status === 'rejected',
    },
  };
}

export function modelForCountry(countryCode: string, postalCodeStrength: CountryValidationModel['postalCodeStrength']): CountryValidationModel {
  return {
    countryCode: countryCode.toUpperCase(),
    postalCodeStrength,
    requiredForDelivery: ['countryCode', 'administrativeArea', 'municipality'],
    requiredForIdentity: ['countryCode', 'administrativeArea', 'municipality', 'streetOrBlock'],
    acceptsPostalEquivalent: postalCodeStrength !== 'strong',
  };
}

