import type { Metadata } from "next";
import AppProviders from "@/components/providers/AppProviders";

// Import global styles (includes Tailwind, design tokens, and utilities)
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CS Career Tracker",
  description: "Career tracking application for applicants, recruiters, and admins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
