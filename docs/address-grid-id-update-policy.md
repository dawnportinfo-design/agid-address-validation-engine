# Address-Grid-ID Update Selection Policy

This policy separates what may be pushed to
[`dawnportinfo-design/Address-Grid-ID`](https://github.com/dawnportinfo-design/Address-Grid-ID)
from what must remain local, commercial, or unpublished.

## Update Allowed

Push only when the change is:

- open-source compatible;
- covered by tests or a documented verification command;
- free of private address content;
- free of commercial secrets and paid connector credentials;
- useful to external developers or researchers;
- small enough to review;
- not a generated artifact unless explicitly part of a release pack.

Examples:

- public validation engine code;
- schemas and safe test vectors;
- docs that explain public architecture;
- no-private-data safety scans;
- backend-only OSS APIs;
- SDK specs that pass generation tests;
- compatibility contracts shared across repos.

## Do Not Update

Do not push these to `Address-Grid-ID`:

- commercial service code;
- customer-specific, delivery-party, hotel, carrier, POS, PMS, or payment-specific material;
- local deployment config;
- private datasets;
- generated bulk files without review;
- low-quality research notes;
- UI experiments not passing app-shell tests;
- broken SDK outputs;
- logs, screenshots, cache, build output, or temporary exports;
- code whose license source is unclear.

## Needs Review Before Update

These may become publishable after review:

- country data imports;
- postal-code datasets;
- large generated SDK updates;
- research papers;
- ZK proof examples;
- Ethereum adapters;
- external service integration stubs;
- AI-generated docs.

Required gate:

```bash
npm run verify
```

or a smaller documented command for the affected package.

## Local vs GitHub Code

```text
Local-only:
  local/
  fixtures/private/
  data/private/
  exports/private/
  .env*

GitHub-safe:
  src/
  specs/
  tests/
  docs/
  scripts/verification-only
```

The main app may keep local operational experiments. Public GitHub repositories
should receive only clean, explainable, tested OSS units.
