# AGID Address Validation Engine

AGID Address Validation Engine is a backend-only open-source validation engine
derived from the public-safe parts of
[`Address-Grid-ID`](https://github.com/dawnportinfo-design/Address-Grid-ID).

The repository validates address structure, country model compatibility,
postal-equivalent consistency, AGID / AOID reference shape, source confidence,
and privacy-safe output status. It does not publish commercial connectors,
private deployment code, UI experiments, or low-quality generated material.

## Purpose

This repository answers:

- Is an address structurally complete enough for a declared purpose?
- Does it match the country model and postal-equivalent policy?
- Is it safe to return `verified`, `partial`, or `manual_required`?
- Can the result be exposed without private address content?

## Relationship to Address-Grid-ID

```text
Address-Grid-ID
  -> full app, maps, UI, operations, research, local experiments

agid-address-validation-engine
  -> backend-only OSS validation core, test vectors, safe public API model
```

The full app can depend on this repository. This repository must not depend on
the full app.

## What Is Publishable Here

- validation types;
- country model interface;
- postal-equivalent policy checks;
- AGID / AOID reference checks;
- issue taxonomy;
- synthetic tests;
- CI and safety scans;
- documentation for open-source validation behavior.

## What Must Stay Out

- commercial connectors;
- private deployment settings;
- raw production address datasets;
- personal delivery records;
- sensitive location material;
- PMS / POS / carrier secrets;
- UI prototypes;
- low-quality generated docs or experiments;
- files that have not passed `npm run verify`.

## Quick Start

```bash
npm install
npm run verify
```

Verification is local-only. It does not call external services.

## License

MIT for code. Documentation is CC BY 4.0, see `LICENSE-PAPERS.md`.
