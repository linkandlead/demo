import { CMS_MEDIA, CMS_VIDEO } from "./cms-media";
// Gegenereerd bij het plaatsen van de verbeterde beelden (NOVA_17_afbeeldingen_verbeterd.zip).
// Per mediasleutel: originele afmetingen en beschikbare kleinere breedtes (`<naam>-<breedte>.webp`).

export const MEDIA: Record<
  string,
  { w: number; h: number; varianten: number[] }
> = {
  comm_arch: {
    w: 1400,
    h: 950,
    varianten: [640, 1280],
  },
  comm_event: {
    w: 1400,
    h: 930,
    varianten: [640, 1280],
  },
  comm_face: {
    w: 1200,
    h: 1450,
    varianten: [640],
  },
  comm_man: {
    w: 1200,
    h: 1350,
    varianten: [640],
  },
  comm_person: {
    w: 1200,
    h: 1200,
    varianten: [640],
  },
  event_gradient: {
    w: 1600,
    h: 1100,
    varianten: [640, 1280],
  },
  event_lights: {
    w: 1800,
    h: 1050,
    varianten: [640, 1280],
  },
  hero_arch: {
    w: 1920,
    h: 1280,
    varianten: [640, 1280],
  },
  journal_arch: {
    w: 1750,
    h: 980,
    varianten: [640, 1280],
  },
  journal_event: {
    w: 1400,
    h: 850,
    varianten: [640, 1280],
  },
  journal_face: {
    w: 1800,
    h: 1080,
    varianten: [640, 1280],
  },
  journal_person: {
    w: 1400,
    h: 880,
    varianten: [640, 1280],
  },
  space_atrium: {
    w: 1912,
    h: 940,
    varianten: [640, 1280],
  },
  work_arch: {
    w: 1800,
    h: 1080,
    varianten: [640, 1280],
  },
  work_beige: {
    w: 1800,
    h: 650,
    varianten: [640, 1280],
  },
  work_color: {
    w: 1200,
    h: 1550,
    varianten: [640],
  },
  work_person: {
    w: 1600,
    h: 1040,
    varianten: [640, 1280],
  },
};

// Video's per bron-URL: de kleinere versies en de posters die erbij horen. De video's staan in de
// mediabibliotheek van het CMS. Het oude pad op de site zelf (/media/nova-film-liggend.mp4, zo stond het
// eerder in het CMS) verwijst naar dezelfde CMS-bestanden.
const NOVA_FILM = {
  mobiel: CMS_VIDEO.staand,
  // 1280×720 voor tablets en kleinere laptops (4,4 MB in plaats van 10,9 MB)
  middel: CMS_VIDEO.liggend720,
  poster: CMS_MEDIA["nova-film-poster"],
  mobielPoster: CMS_MEDIA["nova-film-mobiel-poster"],
};
export const VIDEO: Record<
  string,
  { src?: string; mobiel?: string; middel?: string; poster?: string; mobielPoster?: string }
> = {
  [CMS_VIDEO.liggend]: NOVA_FILM,
  "/media/nova-film-liggend.mp4": { ...NOVA_FILM, src: CMS_VIDEO.liggend },
};
