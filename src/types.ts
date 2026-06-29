export type ValidationPurpose =
  | 'delivery'
  | 'identity'
  | 'map_search'
  | 'postal_equivalent'
  | 'field_handoff'
  | 'hotel_checkin'
  | 'research';

export type ValidationStatus = 'verified' | 'partial' | 'manual_required' | 'rejected';

export type IssueSeverity = 'info' | 'warning' | 'error' | 'blocked';

export type ValidationIssue = {
  code: string;
  severity: IssueSeverity;
  message: string;
};

export type AddressComponents = {
  countryCode: string;
  administrativeArea?: string;
  municipality?: string;
  locality?: string;
  streetOrBlock?: string;
  buildingOrUnit?: string;
  postalCode?: string;
  postalEquivalentZone?: string;
  agidRef?: string;
  aoidRef?: string;
  sourceConfidence?: number;
};

export type CountryValidationModel = {
  countryCode: string;
  postalCodeStrength: 'strong' | 'weak' | 'missing';
  requiredForDelivery: Array<keyof AddressComponents>;
  requiredForIdentity: Array<keyof AddressComponents>;
  acceptsPostalEquivalent: boolean;
};

export type ValidationInput = {
  purpose: ValidationPurpose;
  components: AddressComponents;
  countryModel: CountryValidationModel;
};

export type SafePublicResult = {
  quality: ValidationStatus;
  agidRef?: string;
  postalEquivalent: boolean;
  manualReview: boolean;
};

export type ValidationResult = {
  schemaVersion: 'address-validation-result-v0.1';
  status: ValidationStatus;
  issues: ValidationIssue[];
  safePublicResult: SafePublicResult;
};

