// Mag de site geïndexeerd worden? Standaard niet: NOVA is een demo. Zet SITE_INDEXEREN=ja om
// zoekmachines toe te laten (robots.txt, de robots-meta en de sitemap volgen dan vanzelf).
export const magIndexeren = () => process.env.SITE_INDEXEREN?.trim().toLowerCase() === "ja";
