// Fictieve voorbeeldgegevens voor blokken waarvan de NOVA-demosite (nog) geen records in het CMS
// heeft: testimonials, reviews, wedstrijden, agendaslots en klantlogo's. Alles is verzonnen en wordt
// op de site als voorbeeld gemarkeerd. Zodra het CMS echte records levert, worden die gebruikt.

export const voorbeeldTestimonial = {
  citaat: "Voor het eerst konden we zelf een campagnepagina bouwen, zonder dat het ontwerp uit elkaar viel.",
  naam: "Lotte Verbeek",
  functie: "Hoofd marketing",
  organisatie: "Atelier North (fictief)",
  foto: "/media/journal_face.webp",
};

export const voorbeeldReviews = [
  { naam: "Sam de Wit", bedrijf: "Studio Kade", rating: 5, tekst: "Heldere blokken, snel resultaat. Ons team publiceert nu zelf." },
  { naam: "Noor Bakker", bedrijf: "Lumen Collectief", rating: 4, tekst: "Fijn dat de huisstijl per site vastligt. Alles blijft consistent." },
  { naam: "Ilias Amrani", bedrijf: "Field Office", rating: 5, tekst: "De rondleiding liet precies zien wat we zelf kunnen beheren." },
];

export const voorbeeldWedstrijden = [
  { datum: "2027-04-24", tijd: "16:00", thuis: true, tegenstander: "Atlas FC", competitie: "Eerste klasse", locatie: "NOVA Park" },
  { datum: "2027-05-01", tijd: "14:30", thuis: false, tegenstander: "Harbor City", competitie: "Eerste klasse", locatie: "Harbor Arena" },
  { datum: "2027-05-08", tijd: "15:00", thuis: true, tegenstander: "Riverside SC", competitie: "Beker", locatie: "NOVA Park" },
];

export const voorbeeldSlots = [
  { datum: "2027-03-02", tijd: "10:00", persoon: "Maya Chen" },
  { datum: "2027-03-02", tijd: "14:30", persoon: "Maya Chen" },
  { datum: "2027-03-03", tijd: "09:30", persoon: "Noah Vermeer" },
  { datum: "2027-03-04", tijd: "11:00", persoon: "Amara Brooks" },
  { datum: "2027-03-04", tijd: "15:30", persoon: "Luca Moreno" },
  { datum: "2027-03-05", tijd: "13:00", persoon: "Maya Chen" },
];

export const voorbeeldKlanten = ["Atelier North", "Lumen Collectief", "Field Office", "Studio Kade", "Harbor Labs", "Riverside"];
