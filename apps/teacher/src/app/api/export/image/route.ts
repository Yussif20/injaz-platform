/**
 * GET /api/export/image?profileId=<id>
 * Generates a PNG screenshot of the profile preview using Puppeteer.
 * Returns the image as a binary download.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { createExportToken } from "@/shared/lib/export-token";
import { getBrowserPath } from "@/shared/lib/browser-path";

export const maxDuration = 30; // seconds (for Vercel)

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create a short-lived token for the print page
  const exportToken = createExportToken(accessToken, profileId);

  // Build the URL to the print page.
  // Puppeteer connects to the local server over HTTP — force http:// to avoid
  // ERR_SSL_PROTOCOL_ERROR when the origin reports https (e.g. behind a proxy).
  const port = process.env.PORT || "3000";
  const localBase = `http://localhost:${port}`;
  const templateId = request.nextUrl.searchParams.get("templateId") || "";
  const printUrl = `${localBase}/preview/${profileId}/print?token=${encodeURIComponent(exportToken)}&templateId=${templateId}`;

  let browser;
  try {
    const puppeteer = await import("puppeteer-core");
    browser = await puppeteer.default.launch({
      headless: true,
      executablePath: getBrowserPath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-default-apps",
        "--disable-sync",
        "--disable-translate",
        "--hide-scrollbars",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-first-run",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    // Set viewport width for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });

    // Use domcontentloaded — networkidle never settles in dev mode due to
    // HMR WebSocket. We rely on data-print-ready for actual readiness.
    await page.goto(printUrl, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    // Wait for the print page to signal that content is ready
    await page.waitForSelector("[data-print-ready]", { timeout: 15000 });

    // Fixed delay for images to load and final rendering to settle.
    await new Promise((r) => setTimeout(r, 3000));

    // Take a full-page screenshot
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: "png",
    });

    return new NextResponse(Buffer.from(screenshotBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="portfolio_${profileId}.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Image Export] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image", details: String(error) },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
