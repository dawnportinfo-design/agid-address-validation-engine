# Adoption Readiness: AGID Address Validation Engine

This note explains how the validation engine can be reviewed as a backend-only
open-source component.

## Review Audience

- Developers who need a public validation core separate from the full AGID app.
- Public-good funders evaluating whether address quality can be improved
  without shipping commercial connectors.
- Standards readers evaluating testable validation states.

## Core Public-Good Claim

The engine validates whether an address-like input is structurally and
policy-wise usable for a declared purpose. It returns short states such as
`verified`, `partial`, or `manual_required` and does not publish private
deployment code, connector credentials, or production datasets.

## What Is Verifiable Today

- Backend-only TypeScript reference implementation.
- Synthetic validation fixtures and tests.
- JSON schema checks.
- Publication-safety scan.
- Explicit policy for what can and cannot be copied from the larger
  Address-Grid-ID repository.
- GitHub CI verification.

## What Is Deliberately Not Claimed

- Commercial-grade global address validation.
- Equivalence to proprietary validators.
- Complete coverage for every country.
- Use of live carrier, hotel, POS, or government systems.

## Strongest Grant Fit

- NLnet Foundation: FOSS validation core and open standards.
- Mozilla Foundation: trustworthy public-interest infrastructure.
- Internet Society Foundation: reliable addressing in underserved regions.

## Next Evidence to Add

1. A CLI interface with deterministic local fixtures.
2. A comparison plan against proprietary validators under safe test conditions.
3. Country-model examples for one strong-postal, one weak-postal, and one
   no-postal-code region.
4. Downstream compatibility tests against `agid-interoperability-contracts`.

