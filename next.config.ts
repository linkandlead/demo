import type { NextConfig } from "next";

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
