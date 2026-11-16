import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/content/cms-media";
import { magIndexeren } from "@/lib/indexeren";
import { JsonLd } from "@/components/nova/JsonLd";
import { DemoProvider } from "@/components/nova/DemoMode";
import { SiteHeader } from "@/components/nova/SiteHeader";
import { VoorbeeldBalk } from "@/components/nova/VoorbeeldBalk";
import { cmsInfo, siteInstellingen } from "@/lib/cms/data";
import "@/styles/nova.css";
import "@/styles/nova-extra.css";

export const metadata: Metadata = {
  // Basis voor absolute URL's in Open Graph, canonical en sitemap.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NOVA — Visueel ontwerp voor Link & Lead One",
    template: "%s · NOVA",
  },
  description:
    "NOVA is een fictieve creatieve website die laat zien wat je met een eigen frontend op het Link & Lead One-CMS kunt bouwen.",
  // Standaard noindex (demo); SITE_INDEXEREN=ja zet indexeren aan (zie src/lib/indexeren.ts).
  robots: magIndexeren() ? undefined : { index: false, follow: false },
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
    <html lang="nl" suppressHydrationWarning>
      <head>
        <style id="huisstijl-cms">{huisstijl}</style>
        {/* In een iframe (blokvoorbeeld in de blokkenbibliotheek) alleen het blok tonen, vóór de eerste weergave.
            In de automatische rondleiding (#rondleiding) en in de editor van het CMS (/__voorvertoning) de hele
            pagina, met menu, zonder demoknoppen. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if(window.self!==window.top)document.documentElement.classList.add(location.hash==='#rondleiding'||location.pathname.indexOf('/__voorvertoning')===0?'in-rondleiding':'in-frame')",
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#app">
          Naar de inhoud
        </a>
        <DemoProvider info={info}>
          <JsonLd
            data={{
              "@graph": [
                { "@type": "Organization", "@id": `${SITE_URL}/#organisatie`, name: site.naam, url: SITE_URL, description: "Fictieve creatieve wereld en showcase van Link & Lead One." },
                { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: site.naam, url: SITE_URL, inLanguage: "nl-NL", publisher: { "@id": `${SITE_URL}/#organisatie` } },
              ],
            }}
          />
          <SiteHeader naam={site.naam} hoofd={site.navigatie.hoofd} actie={site.navigatie.actie} />
          <main id="app" tabIndex={-1}>
            {children}
          </main>
        </DemoProvider>
        <VoorbeeldBalk />
      </body>
    </html>
  );
}
