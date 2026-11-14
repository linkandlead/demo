# Vervolgstappen

1. **NOVA-demosite aanmaken en vullen** (eigenaar, zie `docs/cms-koppeling.md`). Daarna `CMS_URL` en
   `CMS_TOKEN` zetten.
2. **Aanvraagroute live zetten:** `CMS_LEAD_SITE_ID` van de Link & Lead-verkoopsite instellen, en een
   testaanvraag doen op een previewdeploy.
3. **Beelden vervangen.** De 17 WebP's zijn kleine crops uit een AI-ontwerpbord (128 kB in totaal).
   Een aantal bevat ingebakken tekst (bijv. `hero_arch` toont "erve e" in de `/one`-showcase,
   en `space_atrium`, `work_arch` en `work_color` hebben bijschriften in het beeld). Vervang ze door
   rechtenvrije beelden in hoge resolutie. Voeg dan `srcset` en AVIF toe en geef de beelden opnieuw
   visueel vrij.
4. **"Collectie (lijst)"** staat in de PDF, maar heeft geen bloktype in de CMS-code. Kies: als kernblok
   bouwen in het CMS, of de PDF bijwerken. Ook de Spaces-ruimtes hebben geen collectie.
5. **Jaartal bij cases** bestaat niet in het CMS. Voeg een veld toe (migratie in het CMS), of laat het
   jaartal in NOVA weg.
6. **Live interacties** (optioneel, per stuk te beslissen): nieuwsbrief via `/api/cms/lead` met
   `soort: nieuwsbrief`, ledenlogin via `api/leden`, tickets via de Mollie-koppeling. Nu bewust
   gesimuleerd.
7. **Navigatie en merk uit het CMS** (`site.navigatie`, `site.merk`) gebruiken zodra de redactie die
   wil beheren.
8. **Lighthouse** draaien op de Vercel-preview (dat kon in deze omgeving niet).
