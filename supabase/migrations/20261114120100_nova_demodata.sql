-- Startinhoud: de fictieve NOVA-content uit het goedgekeurde ontwerp (02_WEBSITE/scripts/nova-app.js).
insert into public.cases (slug, naam, sector, jaar, omschrijving, cover, volgorde, gepubliceerd) values
  ('aurora-pavilion', 'Aurora Pavilion', 'EXPERIENCE', '2026', 'Een sculpturale ontmoetingsplek waar architectuur en licht samenkomen.', 'hero_arch', 1, true),
  ('lumen-experience', 'Lumen Experience', 'CULTURE', '2026', 'Een immersief universum van kleur, licht en beweging.', 'work_color', 2, true),
  ('echo-spaces', 'Echo Spaces', 'DESIGN', '2025', 'Een nieuwe kijk op de ruimte tussen mens en omgeving.', 'work_arch', 3, true),
  ('pulse-festival', 'Pulse Festival', 'EVENT', '2026', 'Drie dagen waarin cultuur en technologie samenkomen.', 'event_lights', 4, true),
  ('future-assembly', 'Future Assembly', 'TECHNOLOGY', '2026', 'Een ideeënfestival voor een verbonden generatie.', 'journal_event', 5, true),
  ('the-atrium', 'The Atrium', 'SPACE', '2025', 'Een lichte, open ruimte waar alles mogelijk wordt.', 'space_atrium', 6, true);

insert into public.artikelen (slug, titel, rubriek, leestijd, cover, gepubliceerd_op, gepubliceerd) values
  ('de-kracht-van-immersive-experiences', 'De kracht van immersive experiences', 'CULTURE', '8 min lezen', 'journal_face', '2026-11-06', true),
  ('ruimtes-die-creativiteit-activeren', 'Ruimtes die creativiteit activeren', 'DESIGN', '6 min lezen', 'journal_arch', '2026-11-05', true),
  ('achter-de-schermen-bij-pulse-festival', 'Achter de schermen bij Pulse Festival', 'EXPERIENCES', '5 min lezen', 'journal_event', '2026-11-04', true),
  ('waarom-de-toekomst-menselijk-blijft', 'Waarom de toekomst menselijk blijft', 'FUTURE', '9 min lezen', 'comm_face', '2026-11-03', true),
  ('designing-for-tomorrow-begins-today', 'Designing for tomorrow begins today', 'INSIGHTS', '11 min lezen', 'work_color', '2026-11-02', true),
  ('het-nieuwe-ontmoeten-is-persoonlijk', 'Het nieuwe ontmoeten is persoonlijk', 'COMMUNITY', '7 min lezen', 'space_atrium', '2026-11-01', true);

insert into public.teamleden (naam, functie, foto, volgorde, gepubliceerd) values
  ('Maya Chen', 'Creative director', 'comm_face', 1, true),
  ('Noah Vermeer', 'Head of experiences', 'comm_man', 2, true),
  ('Amara Brooks', 'Design strategist', 'journal_face', 3, true),
  ('Luca Moreno', 'Community curator', 'comm_person', 4, true);

insert into public.ruimtes (slug, naam, omschrijving, cover, cover_alt, knoptekst, volgorde, gepubliceerd) values
  ('the-atrium', 'The Atrium', 'Open, licht en vol mogelijkheden. Een ruimte die uitnodigt tot nieuwe perspectieven.', 'space_atrium', 'Licht atrium met planten en modern interieur', 'Ontdek deze ruimte', 1, true),
  ('studio-one', 'Studio One', 'Een veelzijdige studio voor workshops, creatieve sessies en presentaties.', 'work_arch', 'Architectonisch paviljoen', 'Bekijk de studio', 2, true),
  ('light-lab', 'Light Lab', 'Een onverwachte omgeving voor eigenzinnige meetings en ervaringen.', 'work_color', 'Kleurrijke ruimtelijke installatie', 'Bekijk de ruimte', 3, true);

insert into public.evenementen (slug, naam, gepubliceerd) values ('nova-sessions', 'NOVA Sessions', true);
