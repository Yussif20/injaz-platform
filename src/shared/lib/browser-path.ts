/**
 * Resolves the Chromium/Chrome executable path for Puppeteer.
 * - In Docker (production): uses PUPPETEER_EXECUTABLE_PATH env var
 * - Locally on Windows: auto-detects Chrome or Edge
 * - Locally on macOS/Linux: checks common paths
 */

import { existsSync } from "fs";

const WINDOWS_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const LINUX_PATHS = [
  "/opt/chrome/chrome/linux-145.0.7632.77/chrome-linux64/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
];

const MAC_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
];

export function getBrowserPath(): string {
  // 1. Env var always wins (set in Docker)
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // 2. Auto-detect by platform
  const platform = process.platform;
  const candidates =
    platform === "win32"
      ? WINDOWS_PATHS
      : platform === "darwin"
        ? MAC_PATHS
        : LINUX_PATHS;

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  // 3. Fallback — will fail with a clear error from Puppeteer
  return "/usr/bin/chromium";
}
