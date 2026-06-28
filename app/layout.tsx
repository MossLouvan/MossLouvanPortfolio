// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Moss Louvan | Software Engineer",
  description:
    "Portfolio of Moss Louvan, AI-focused Software Engineer and NASA App Development Challenge winner.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

// Runs before first paint: applies the saved theme, or falls back to the
// visitor's OS preference. Prevents the dark-mode flash and makes the default
// theme match the user's system instead of always-dark.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = (stored === 'light' || stored === 'dark')
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
