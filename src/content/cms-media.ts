// Beelden in de mediabibliotheek van het CMS (site Demo Klant), geüpload via POST /api/cms/media.
// Pagina's en collecties in het CMS verwijzen naar deze URL's; de blauwdruk gebruikt dezelfde, zodat
// site, CMS-editor en terugval hetzelfde beeld tonen. Een nieuwe upload in het CMS werkt ook zonder
// deze lijst; de lijst is alleen nodig om een CMS-URL terug te koppelen aan de NOVA-alt-tekst.

export const CMS_MEDIA: Record<string, string> = {
  "comm_arch": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/comm-arch-mwhq15aj-u35e0q.webp",
  "comm_event": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/comm-event-mwhq16rj-nei5xk.webp",
  "comm_face": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/comm-face-mwhq18f0-viuawx.webp",
  "comm_man": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/comm-man-mwhq19wz-re5sn7.webp",
  "comm_person": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/comm-person-mwhq1bgl-1fdnl3.webp",
  "event_gradient": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/event-gradient-mwhq1d5c-k4jp61.webp",
  "event_lights": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/event-lights-mwhq1exy-qt4pn4.webp",
  "hero_arch": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/hero-arch-mwhq0ja8-xr2nai.webp",
  "journal_arch": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/journal-arch-mwhq1gfx-o6sdla.webp",
  "journal_event": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/journal-event-mwhq1i26-giygsm.webp",
  "journal_face": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/journal-face-mwhq1kyy-1i1bhv.webp",
  "journal_person": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/journal-person-mwhq1mpq-qptlqa.webp",
  "nova-film-mobiel-poster": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/nova-film-mobiel-poster-mwhq1o17-cllef6.webp",
  "nova-film-poster": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/nova-film-poster-mwhq1ps5-q8afgu.webp",
  "space_atrium": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/space-atrium-mwhq1rio-gv03l3.webp",
  "work_arch": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/work-arch-mwhq1t1k-7l1jcz.webp",
  "work_beige": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/work-beige-mwhq1ulu-e1zes0.webp",
  "work_color": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/work-color-mwhq1wrh-07gtzs.webp",
  "work_person": "https://mucwwqjctynklovacwbv.supabase.co/storage/v1/object/public/media/22222222-2222-2222-2222-222222222222/work-person-mwhq1yam-ck5o02.webp",
};

/** Video's kunnen niet in de mediabibliotheek (alleen JPG, PNG, WebP, GIF, AVIF). Ze staan op de
 *  website zelf; in het CMS staat de volledige URL, zodat ook de CMS-editor ze kan tonen. */
export const SITE_URL = "https://demo.linkandlead.nl";

/** Beeldnaam (bv. "hero_arch") bij een CMS-URL, voor de alt-tekst. */
export function naamBijCmsUrl(url: string): string | undefined {
  for (const [naam, u] of Object.entries(CMS_MEDIA)) if (u === url) return naam;
  return undefined;
}
