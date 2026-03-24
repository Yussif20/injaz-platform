/**
 * GET /api/export/shared-pdf?token=<share-token>&password=<optional>
 * Generates a PDF of a public shared profile using Puppeteer.
 * No auth required — uses the ShareLinks token to access the profile.
 */

import { NextRequest, NextResponse } from "next/server";
import { getBrowserPath } from "@/shared/lib/browser-path";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const shareToken = request.nextUrl.searchParams.get("token");

  if (!shareToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const password = request.nextUrl.searchParams.get("password") || "";

  // Puppeteer connects to the local server over HTTP — force http:// to avoid
  // ERR_SSL_PROTOCOL_ERROR when the origin reports https (e.g. behind a proxy).
  const port = process.env.PORT || "3000";
  const localBase = `http://localhost:${port}`;

  // Build URL to the public print page
  let printUrl = `${localBase}/p/${encodeURIComponent(shareToken)}/print`;
  if (password) {
    printUrl += `?password=${encodeURIComponent(password)}`;
  }

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
    await page.setViewport({ width: 794, height: 1123 });

    await page.goto(printUrl, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    await page.waitForSelector("[data-print-ready]", { timeout: 15000 });

    // Wait for images to load
    await new Promise((r) => setTimeout(r, 3000));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="portfolio.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[Shared PDF Export] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
