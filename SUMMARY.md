# Summary

This repository separates the address validation core from the larger
Address-Grid-ID app.

## Why Separate It

The main Address-Grid-ID repository contains app UI, research notes, SDK
generation, maps, postal data, operational workflows, and local development
artifacts. Not all of that should be pushed as open source at the same quality
bar.

This repository keeps a smaller, testable, backend-only validation engine.

## Boundary

```text
public GitHub code:
  src/
  specs/
  tests/
  docs/

local-only code:
  local/
  fixtures/private/
  secrets
  production exports
```

## Initial Capabilities

- validation status;
- issue taxonomy;
- purpose-aware required fields;
- country model validation;
- postal-equivalent validation;
- privacy-safe result projection;
- no-private-fixture publication scan.

