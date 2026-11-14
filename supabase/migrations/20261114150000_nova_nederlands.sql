-- Alle zichtbare NOVA-content in het Nederlands (sectoren, rubrieken, titels, functies).
update public.cases set sector = case sector
  when 'EXPERIENCE' then 'BELEVING' when 'CULTURE' then 'CULTUUR' when 'DESIGN' then 'ONTWERP'
  when 'EVENT' then 'EVENEMENT' when 'TECHNOLOGY' then 'TECHNOLOGIE' when 'SPACE' then 'RUIMTE' else sector end;
update public.artikelen set rubriek = case rubriek
  when 'CULTURE' then 'CULTUUR' when 'DESIGN' then 'ONTWERP' when 'EXPERIENCES' then 'BELEVINGEN'
  when 'FUTURE' then 'TOEKOMST' when 'INSIGHTS' then 'INZICHTEN' else rubriek end;
update public.artikelen set titel = 'De kracht van meeslepende belevingen' where slug = 'de-kracht-van-immersive-experiences';
update public.artikelen set titel = 'Ontwerpen voor morgen begint vandaag' where slug = 'designing-for-tomorrow-begins-today';
update public.teamleden set functie = case functie
  when 'Creative director' then 'Creatief directeur' when 'Head of experiences' then 'Hoofd belevingen'
  when 'Design strategist' then 'Ontwerpstrateeg' when 'Community curator' then 'Communitycurator' else functie end;
