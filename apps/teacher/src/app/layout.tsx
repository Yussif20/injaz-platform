import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
import { Providers } from "@/shared/providers";
import "./globals.css";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "إنجاز المعلم",
  description: "منصة إنجاز المعلم لتوثيق الإنجازات والشهادات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={alexandria.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
