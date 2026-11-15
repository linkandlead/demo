import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/cms-media";
import { magIndexeren } from "@/lib/indexeren";

// robots.txt: standaard alles dicht (demo). Met SITE_INDEXEREN=ja open, behalve technische routes.
export default function robots(): MetadataRoute.Robots {
  if (!magIndexeren()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/blokvoorbeeld/", "/__voorvertoning"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
