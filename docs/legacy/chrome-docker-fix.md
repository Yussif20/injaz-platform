# Fix: Docker Build Failure — Chrome for Testing Version Pruned

**Date:** 2026-03-26
**App:** injaz-almoalem

## The Error

The Docker build failed at the `chrome` stage with exit code 1:

```
[chrome 5/5] RUN ./node_modules/.bin/browsers install chrome@145.0.7632.77 --install-dir /opt/chrome
    && test -f /opt/chrome/chrome/linux-145.0.7632.77/chrome-linux64/chrome
```

```
Build Failed: process did not complete successfully: exit code: 1
```

## Root Cause

The pinned Chrome for Testing version `145.0.7632.77` was removed from Google's CDN. Google periodically prunes old Chrome for Testing builds, so pinning an exact version will eventually break.

## The Fix

Three changes across two files:

### 1. Dockerfile — Use `chrome@stable` instead of a pinned version

```dockerfile
# Before
RUN ./node_modules/.bin/browsers install chrome@145.0.7632.77 --install-dir /opt/chrome \
    && test -f /opt/chrome/chrome/linux-145.0.7632.77/chrome-linux64/chrome

# After (install to cwd then copy — --install-dir is unreliable with @stable)
RUN ./node_modules/.bin/browsers install chrome@stable \
    && mkdir -p /opt/chrome \
    && cp -r chrome/* /opt/chrome/ \
    && ln -s "$(find /opt/chrome -name chrome -type f | head -1)" /opt/chrome/chrome-binary
```

### 2. Dockerfile — Update the env var to use the symlink

```dockerfile
# Before
ENV PUPPETEER_EXECUTABLE_PATH=/opt/chrome/chrome/linux-145.0.7632.77/chrome-linux64/chrome

# After
ENV PUPPETEER_EXECUTABLE_PATH=/opt/chrome/chrome-binary
```

### 3. `src/shared/lib/browser-path.ts` — Update the Linux fallback path

```typescript
// Before
"/opt/chrome/chrome/linux-145.0.7632.77/chrome-linux64/chrome",

// After
"/opt/chrome/chrome-binary",
```

## Why This Won't Break Again

- `chrome@stable` always resolves to the current stable Chrome for Testing release — it never gets pruned.
- The symlink at `/opt/chrome/chrome-binary` decouples the executable path from the version number, so Chrome updates don't require Dockerfile changes.
