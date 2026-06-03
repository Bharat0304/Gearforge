import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gearforge — AI 3D Asset Platform",
  description: "The AI workspace for production-ready 3D asset generation. Built for creators who ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise">{children}</body>
    </html>
  );
}
