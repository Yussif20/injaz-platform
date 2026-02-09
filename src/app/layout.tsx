import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { TranslationProvider } from "@/i18n/TranslationContext";
import { Providers } from "@/shared/providers";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Injaz Dashboard",
  description: "Injaz Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={alexandria.variable}>
        <TranslationProvider>
          <Providers>{children}</Providers>
        </TranslationProvider>
      </body>
    </html>
  );
}
