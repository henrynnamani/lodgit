"use client";
import "./globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://your-convex-url.convex.cloud"
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>LodgeIt — Student Housing, Simplified</title>
        <meta name="description" content="Find verified student accommodation near your campus" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="grain">
        <ConvexProvider client={convex}>{children}</ConvexProvider>
      </body>
    </html>
  );
}
