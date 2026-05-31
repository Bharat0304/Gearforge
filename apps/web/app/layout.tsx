import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gearforge — AI 3D Design Platform",
  description: "From texts, images, or sketches to production-ready 3D assets in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}
