import type { Metadata } from "next";
import { Alexandria } from "next/font/google";
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
    <html>
      <body className={alexandria.variable}>{children}</body>
    </html>
  );
}
