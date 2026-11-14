import type { Metadata, Viewport } from "next";
import { DemoProvider } from "@/components/nova/DemoMode";
import { SiteHeader } from "@/components/nova/SiteHeader";
import { cmsInfo, siteInstellingen } from "@/lib/cms/data";
import "@/styles/nova.css";
import "@/styles/nova-extra.css";

export const metadata: Metadata = {
  title: {
    default: "NOVA — Visueel ontwerp voor Link & Lead One",
    template: "%s · NOVA",
  },
  description:
    "NOVA is een fictieve creatieve website die laat zien wat je met een eigen frontend op het Link & Lead One-CMS kunt bouwen.",
  robots: { index: false, follow: false },
};

// Content uit het CMS ververst elke 60 s (gelijk aan de cache van de CMS-lees-API).
export const revalidate = 60;

export const viewport: Viewport = { themeColor: "#0B1127" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [info, site] = await Promise.all([cmsInfo(), siteInstellingen()]);
  // Huisstijlkleuren uit het CMS (gevalideerd als #hex) worden de CSS-variabelen van het ontwerp.
  const huisstijl = `:root{${Object.entries(site.cssVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
  return (
    <html lang="nl">
      <head>
        <style id="huisstijl-cms">{huisstijl}</style>
      </head>
      <body>
        <a className="skip-link" href="#app">
          Naar de inhoud
        </a>
        <DemoProvider info={info}>
          <SiteHeader naam={site.naam} hoofd={site.navigatie.hoofd} actie={site.navigatie.actie} />
          <main id="app" tabIndex={-1}>
            {children}
          </main>
        </DemoProvider>
      </body>
    </html>
  );
}
