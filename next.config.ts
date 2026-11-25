import type { NextConfig } from "next";
import { cspVerbinding } from "./src/lib/meting/config";

// T21: Content-Security-Policy voor de publieke site. Next.js zet inline scripts en stijlen neer, dus die blijven
// toegestaan; de winst zit in alles wat niet van de eigen site, een afbeeldingshost of een bekende videospeler komt.
// frame-ancestors staat hier bewust niet in: X-Frame-Options regelt dat, en /__voorvertoning zet zijn eigen waarde.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${cspVerbinding(process.env).join(" ")}`.trim(),
  "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Aparte buildmap mogelijk voor tests (bv. een build tegen het nep-CMS).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        // Niet op /__voorvertoning: die route mag in de editor van het CMS staan en zet zelf
        // frame-ancestors 'self' <CMS> (linkandlead-cms B-110). De rest van de site blijft SAMEORIGIN.
        source: "/:path((?!__voorvertoning).*)",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
      {
        source: "/(media|fonts|brand)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
