-- Definitieve websiteteksten (NOVA_alle_website_teksten.md), volledig Nederlands.
update public.cases set omschrijving = v.oms from (values
  ('aurora-pavilion', 'Een sculpturale ontmoetingsplek waar architectuur en licht samenkomen.'),
  ('lumen-experience', 'Een meeslepende wereld van licht, kleur en beweging.'),
  ('echo-spaces', 'Een nieuwe blik op de ruimte tussen mens en omgeving.'),
  ('pulse-festival', 'Een ontmoetingsplek voor cultuur, technologie en nieuwsgierige mensen.'),
  ('future-assembly', 'Een ideeënfestival voor een generatie die liever samen begint.'),
  ('the-atrium', 'Een lichte, open omgeving waar ontmoeting ruimte krijgt.')
) as v(slug, oms) where cases.slug = v.slug;

update public.ruimtes set omschrijving = v.oms, knoptekst = v.knop, cover_alt = v.alt from (values
  ('the-atrium', 'Een open, lichte ruimte waar ideeën de ruimte krijgen.', 'Bekijk The Atrium', 'Ruim licht atrium met grote ramen, planten en warme zithoeken.'),
  ('studio-one', 'Een veelzijdige studio voor workshops, creatieve sessies en presentaties.', 'Bekijk Studio One', 'Strakke moderne architectuur met geometrische vlakken en zonlicht.'),
  ('light-lab', 'Een experimentele plek waar licht en geluid de sfeer bepalen.', 'Bekijk Light Lab', 'Meeslepende installatie met oranje, paarse en blauwe lichtbanen en bezoekers.')
) as v(slug, oms, knop, alt) where ruimtes.slug = v.slug;

insert into public.evenementen (slug, naam, gepubliceerd)
values ('pulse-festival', 'Pulse Festival', true)
on conflict (slug) do nothing;

-- Artikelen: intro en leestijd. De volledige hoofdtekst staat als standaard in src/content/teksten.ts;
-- een gevulde kolom hoofdtekst ("## kop" + alinea's, gescheiden door lege regels) overschrijft die.
update public.artikelen set samenvatting = v.intro, leestijd = v.lees from (values
  ('de-kracht-van-immersive-experiences', 'Een verhaal dat je niet alleen ziet, maar voelt. Wat maakt meeslepende belevingen zo bijzonder?', '3 min lezen'),
  ('ruimtes-die-creativiteit-activeren', 'Waarom sommige ruimtes onmiddellijk iets in beweging brengen, terwijl andere vooral functioneel zijn.', '2 min lezen'),
  ('achter-de-schermen-bij-pulse-festival', 'Hoe bouw je een festival waar het programma en de beleving één verhaal vertellen?', '2 min lezen'),
  ('waarom-de-toekomst-menselijk-blijft', 'In een wereld die steeds digitaler wordt, groeit juist de waarde van menselijke aandacht.', '2 min lezen'),
  ('designing-for-tomorrow-begins-today', 'Een toekomstbestendig idee begint niet met voorspellen, maar met aandachtig ontwerpen.', '2 min lezen'),
  ('het-nieuwe-ontmoeten-is-persoonlijk', 'Waarom echte verbinding niet ontstaat door meer contacten, maar door betere ontmoetingen.', '2 min lezen')
) as v(slug, intro, lees) where artikelen.slug = v.slug;
