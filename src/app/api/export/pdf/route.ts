/**
 * GET /api/export/pdf?profileId=<id>
 * Generates a PDF of the profile preview using Puppeteer.
 * Returns the PDF as a binary download.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/shared/lib/cookies";
import { createExportToken } from "@/shared/lib/export-token";

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

  // Build the URL to the print page
  const baseUrl = request.nextUrl.origin;
  const templateId = request.nextUrl.searchParams.get("templateId") || "";
  const printUrl = `${baseUrl}/preview/${profileId}/print?token=${encodeURIComponent(exportToken)}&templateId=${templateId}`;

  let browser;
  try {
    const puppeteer = await import("puppeteer");
    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    // Set viewport to A4-ish width for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });

    console.log("[PDF Export] Navigating to:", printUrl);

    // Use domcontentloaded — networkidle never settles in dev mode due to
    // HMR WebSocket. We rely on data-print-ready for actual readiness.
    await page.goto(printUrl, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    console.log("[PDF Export] Page loaded, waiting for content...");

    // Wait for the print page to signal that content is ready
    await page.waitForSelector("[data-print-ready]", { timeout: 15000 });

    console.log("[PDF Export] Content ready, waiting for render...");

    // Fixed delay for images to load and final rendering to settle.
    // page.evaluate for image onload is unreliable here because the auth
    // provider's failed requests can invalidate the page context.
    await new Promise((r) => setTimeout(r, 3000));

    console.log("[PDF Export] Generating PDF...");

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", bottom: "0", left: "0", right: "0" },
      preferCSSPageSize: false,
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="portfolio_${profileId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[PDF Export] Error:", error);
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
