// Definitieve websiteteksten (bron: NOVA_alle_website_teksten.md), volledig in het Nederlands.
// NOVA is fictief: alle cases, personen, events, ruimtes, prijzen en citaten zijn voorbeeldcontent.
// Lijstgegevens kunnen ook uit Supabase of het CMS komen; deze teksten zijn dan de terugval.

export const merk = {
  tagline: "Ideeën verdienen werkelijkheid.",
  payoffNova: "Waar ideeën hun mensen vinden.",
  payoffCms: "Je zag de website. Ontdek wat erachter zit.",
  microtaglineCms: "Bijzonder design. Overzichtelijk beheer.",
};

export const footerTekst = {
  eyebrow: "WAT IS DE VOLGENDE STAP?",
  kop: "Heb je iets bijzonders in gedachten?",
  tekst:
    "Een idee verdient meer dan een goed gesprek. Laat ons ontdekken wat we samen kunnen maken.",
  knop: "Vertel ons je idee",
  cmsKop: "Gemaakt om te inspireren. Ontworpen voor Link & Lead One.",
  cmsTekst:
    "NOVA is fictief. De mogelijkheden van het CMS erachter zijn het verhaal.",
  cmsKnop: "Ontdek het CMS",
  disclaimer:
    "NOVA is een fictieve voorbeeldwebsite. Projecten, personen, evenementen, prijzen en beoordelingen zijn demonstratiecontent.",
  copyright: "© 2026 NOVA — demonstratieconcept van Link & Lead One.",
};

// ---------- Projecten ----------
export type CaseDetail = {
  projectintro: string;
  vraag: string;
  concept: string;
  aanpak: string;
  resultaat: string;
  statement: string;
  diensten: string[];
  beelden: [string, string, string];
};

export const caseDetails: Record<string, CaseDetail> = {
  "aurora-pavilion": {
    projectintro:
      "Wat als een gebouw niet alleen een plek is, maar ook een verhaal dat je binnenstapt?",
    vraag:
      "Voor deze fictieve case onderzochten we hoe architectuur een actieve rol kan spelen in de beleving van bezoekers. Niet als achtergrond, maar als onderdeel van wat mensen onthouden.",
    concept:
      "Aurora Pavilion bestaat uit grote, vloeiende vormen. Koelblauw beton ontmoet warm licht en een stille horizon. De bezoeker wordt vanzelf onderdeel van het beeld, zonder dat één woord uitleg nodig is.",
    aanpak:
      "We beginnen met de route van de bezoeker: wat zie je van veraf, wanneer verandert het perspectief en waar ontstaat een moment van verwondering? Daarna brengen we vorm, licht en beweging samen in één helder concept.",
    resultaat:
      "Een visueel sterke, fictieve locatie die laat zien hoe je een projectcase kunt presenteren met hero, feiten, fotografie, verhaal en gerelateerde projecten.",
    statement: "Een ruimte krijgt betekenis door wat mensen erin ervaren.",
    diensten: [
      "Conceptontwikkeling",
      "Ruimtelijk ontwerp",
      "Storytelling",
      "Beeldregie",
    ],
    beelden: ["hero_arch", "work_arch", "comm_arch"],
  },
  "lumen-experience": {
    projectintro:
      "Een ruimte zonder vast verhaal. Tot de bezoeker begint te bewegen.",
    vraag:
      "Hoe maak je van een grote hal een belevenis die niet om uitleg vraagt? Voor deze voorbeeldcase kozen we niet voor schermen vol informatie, maar voor licht dat reageert op de ruimte.",
    concept:
      "Grote transparante doeken vangen oranje, roze en violet licht. Mensen bewegen ertussen en ontdekken hun eigen route. Iedere blik toont een andere compositie.",
    aanpak:
      "We ontwerpen vanuit ritme: een langzame entree, een intens middengebied en een rustige uitgang. De ervaring heeft een duidelijk begin en einde, maar nergens één verplicht pad.",
    resultaat:
      "Een fictieve beleving die ideaal is om de kracht van een visueel portfolio, beeldcarrousel en thematische collectie te demonstreren.",
    statement:
      "Je hoeft een ervaring niet te begrijpen om er iets bij te voelen.",
    diensten: [
      "Belevingsconcept",
      "Lichtregie",
      "Ruimtelijk ontwerp",
      "Bezoekersreis",
    ],
    beelden: ["work_color", "event_gradient", "journal_event"],
  },
  "echo-spaces": {
    projectintro: "Soms is het meest opvallende aan een ruimte wat je weglaat.",
    vraag:
      "De fictieve opdracht was helder: ontwerp een plek waar ontmoeting vanzelf gaat, zonder de aandacht op te eisen.",
    concept:
      "Lichte materialen, open zichtlijnen en zorgvuldig gekozen accenten maken de ruimte rustig én levendig. Bezoekers bepalen zelf hoe ze haar gebruiken.",
    aanpak:
      "We brachten beweging, akoestiek en licht samen in een serie kleine ontwerpkeuzes. Niet één groot gebaar, maar honderd details die elkaar versterken.",
    resultaat:
      "Een voorbeeldcase over subtiel design, waarmee we feiten, afbeeldingen, tekstblokken en gerelateerde content kunnen tonen.",
    statement: "Goede ruimtes laten mensen de hoofdrol spelen.",
    diensten: [
      "Interieurconcept",
      "Ruimtelijk ontwerp",
      "Materialisatie",
      "Gebruikersonderzoek",
    ],
    beelden: ["work_arch", "work_beige", "space_atrium"],
  },
  "pulse-festival": {
    projectintro:
      "Drie dagen waarin nieuwe ideeën niet alleen besproken, maar ook beleefd worden.",
    vraag:
      "Hoe maak je een evenement met veel verschillende disciplines toch herkenbaar als één geheel? Dat was het vertrekpunt van deze fictieve productie.",
    concept:
      "Een festival met een duidelijke rode draad: ontdekken, creëren en verbinden. Van intieme gesprekken tot grote lichtinstallaties versterken alle onderdelen hetzelfde verhaal.",
    aanpak:
      "We vertaalden die drie woorden naar routing, programma, communicatie en beleving. Zo begrijpt de bezoeker de sfeer al voordat hij het terrein betreedt.",
    resultaat:
      "Een fictieve eventcase die via het CMS gekoppeld kan worden aan programma, sprekers, tickets en gerelateerde artikelen.",
    statement:
      "Een sterk evenement begint niet bij het podium, maar bij de ontmoeting.",
    diensten: [
      "Eventconcept",
      "Programmaontwikkeling",
      "Visuele identiteit",
      "Communicatie",
    ],
    beelden: ["event_lights", "event_gradient", "journal_event"],
  },
  "future-assembly": {
    projectintro:
      "Technologie verandert wat we kunnen. Mensen bepalen waarom het ertoe doet.",
    vraag:
      "Veel gesprekken over technologie gaan over producten. Future Assembly draait in deze fictieve case juist om de vragen die erachter liggen.",
    concept:
      "Korte keynotes, open tafels en co-creatiesessies brengen verschillende generaties samen. Een visuele identiteit van licht, kleur en typografie verbindt het programma.",
    aanpak:
      "Iedere sessie eindigt met één concrete vraag aan de zaal. De antwoorden vormen samen de basis voor het volgende onderdeel. Zo wordt het publiek deelnemer.",
    resultaat:
      "Een voorbeeld van hoe je een technologie-evenement presenteert met sprekers, tijdschema, artikelen en inschrijfformulier.",
    statement: "De interessantste ideeën komen zelden van één persoon.",
    diensten: ["Programmaconcept", "Workshops", "Community", "Eventdesign"],
    beelden: ["journal_event", "event_lights", "work_color"],
  },
  "the-atrium": {
    projectintro:
      "Licht, lucht en genoeg vrijheid om een bijeenkomst eigen te maken.",
    vraag:
      "Een ruimte moet verschillende groepen kunnen ontvangen en toch een eigen karakter behouden. Dat was de fictieve ontwerpvraag.",
    concept:
      "Een groot atrium met daglicht, groen en een rustige materialisering. Van presentatie tot diner verandert de opstelling, terwijl de herkenbare sfeer blijft.",
    aanpak:
      "We kijken eerst naar het gebruik en pas daarna naar de inrichting. Hoe bewegen mensen? Waar begint het gesprek? En hoeveel flexibiliteit is echt nodig?",
    resultaat:
      "Een visuele voorbeeldcase die aansluit op de ruimtecollectie en laat zien hoe dezelfde content op meerdere plekken relevant is.",
    statement: "De beste ruimte laat iedereen op zijn gemak binnenkomen.",
    diensten: [
      "Ruimteconcept",
      "Inrichting",
      "Gastbeleving",
      "Eventopstellingen",
    ],
    beelden: ["space_atrium", "comm_arch", "work_beige"],
  },
};

// ---------- Artikelen ----------
export type ArtikelTekst = {
  intro: string;
  secties: Array<[string, string]>;
  slot: string;
  leestijd: string;
};

export const artikelen: Record<string, ArtikelTekst> = {
  "de-kracht-van-immersive-experiences": {
    leestijd: "3 min lezen",
    intro:
      "Een verhaal dat je niet alleen ziet, maar voelt. Wat maakt meeslepende belevingen zo bijzonder?",
    secties: [
      [
        "Beleving begint bij aandacht",
        "Een meeslepende beleving is geen verzameling indrukwekkende projecties. Het is een ervaring die de aandacht van een bezoeker ergens naartoe leidt. Soms gebeurt dat met geluid of licht, soms juist met stilte. Wat telt is dat alle onderdelen samen iets oproepen. Je loopt niet langs een verhaal. Je maakt er even deel van uit.",
      ],
      [
        "De bezoeker wordt onderdeel van het ontwerp",
        "In traditionele communicatie bepaalt de maker meestal de volgorde. Een boek heeft pagina’s, een presentatie heeft slides. In een ruimtelijke ervaring beweegt de bezoeker zelf. Dat vraagt om een ander soort ontwerp: niet alleen een goed begin en einde, maar ook betekenisvolle momenten ertussen. Een goede installatie beloont nieuwsgierigheid zonder de bezoeker de weg kwijt te laten raken.",
      ],
      [
        "Techniek is nooit het einddoel",
        "Nieuwe techniek kan veel, maar verrassing alleen is niet genoeg. De kracht zit in de combinatie van een helder idee, een passende omgeving en aandacht voor menselijke reacties. Als technologie het verhaal ondersteunt, wordt ze bijna onzichtbaar. Wat overblijft is het gevoel dat iemand mee naar buiten neemt.",
      ],
      [
        "Wat merken hiervan kunnen leren",
        "Ook buiten musea of festivals heeft deze manier van denken waarde. Een merkpresentatie, congres of tijdelijke ruimte kan meer worden dan een reeks boodschappen. Begin niet met de vraag welke techniek beschikbaar is. Begin met de vraag: wat moet de bezoeker ervaren, begrijpen of onthouden? Dan volgt de vorm vanzelf.",
      ],
      [
        "Van scherm naar ontmoeting",
        "De mooiste ervaringen eindigen niet bij de uitgang. Ze geven bezoekers iets om over te praten. En juist dat maakt beleving interessant: je ontwerpt niet alleen wat iemand ziet, maar ook het gesprek dat daarna ontstaat.",
      ],
      [
        "De kracht van ruimte en ritme",
        "Het tempo van een ervaring bepaalt hoeveel aandacht bezoekers kunnen geven. Een indrukwekkend beeld heeft soms juist een rustmoment nodig om te landen. Door drukte en stilte af te wisselen, krijgt het publiek tijd om zelf betekenis te geven aan wat het ziet. Ook de omgeving doet mee: een smalle doorgang maakt een groot open veld sterker, terwijl een zachte geluidslaag een vertrouwd detail plotseling spannend kan maken. Goed belevingsontwerp is daarom ook regie van tijd en ruimte.",
      ],
      [
        "Een ervaring voor meer mensen",
        "Een bijzondere ervaring is pas echt sterk wanneer zoveel mogelijk mensen eraan kunnen deelnemen. Heldere routing, leesbare informatie, rustige alternatieven en aandacht voor verschillende zintuiglijke behoeften maken een concept toegankelijker. Ontwerp daarom vanaf het begin voor uiteenlopende bezoekers, in plaats van achteraf extra oplossingen toe te voegen. Dat vraagt soms om concessies aan het spectaculaire, maar levert meestal iets beters op: een ervaring die niet alleen indruk maakt, maar ook uitnodigt.",
      ],
    ],
    slot: "Een sterke ervaring is geen decor. Ze geeft mensen een nieuwe manier om naar de wereld te kijken.",
  },
  "ruimtes-die-creativiteit-activeren": {
    leestijd: "2 min lezen",
    intro:
      "Waarom sommige ruimtes onmiddellijk iets in beweging brengen, terwijl andere vooral functioneel zijn.",
    secties: [
      [
        "De ruimte is nooit neutraal",
        "Een omgeving beïnvloedt hoe we ons gedragen. In een formele vergaderzaal wachten mensen vaak op hun beurt. In een open studio lopen gesprekken sneller door elkaar. Het is niet zo dat de ene ruimte altijd beter is. Het gaat om de vraag welke vorm van interactie je wilt stimuleren.",
      ],
      [
        "Denk aan het ritme van een dag",
        "Een inspirerende locatie biedt verschillende momenten: concentreren, ontmoeten, presenteren, pauzeren. Wanneer al die activiteiten in exact dezelfde setting plaatsvinden, ontstaat al snel vermoeidheid. Met kleine veranderingen in licht, akoestiek en meubilair kan een ruimte meerdere rollen spelen.",
      ],
      [
        "Laat de plek iets toevoegen",
        "Een bijzonder gebouw hoeft niet vol prikkels te zitten. Soms maakt juist daglicht, groen of een verrassend uitzicht het verschil. De kunst is om niet elke vierkante meter te willen vullen. Lege ruimte geeft ideeën de kans om te ontstaan.",
      ],
      [
        "Ontwerp voor gebruik, niet voor de foto",
        "Een perfecte foto zegt weinig over de beleving van een bezoeker. Zijn er plekken om rustig te praten? Is de routing vanzelfsprekend? Voelen mensen zich welkom? Goede ruimtelijke ontwerpen zijn mooi én bruikbaar.",
      ],
      [
        "Een uitnodiging om anders te denken",
        "Wie een creatieve bijeenkomst organiseert, kan beginnen met een simpele vraag: wat moet deze ruimte bij mensen losmaken? Het antwoord is misschien belangrijker dan de keuze van stoelen of schermen.",
      ],
      [
        "Verschillende mensen, verschillende behoeften",
        "Een goede ruimte kan nooit voor iedereen precies hetzelfde betekenen. Sommige bezoekers denken beter in stilte; anderen komen op ideeën door beweging en gesprek. Maak daarom verschillende gebruiksvormen mogelijk. Een centrale tafel kan prettig zijn voor besluiten, terwijl losse zitplekken een persoonlijk gesprek op gang brengen. Het gaat niet om een vast ideaalplaatje, maar om vrijheid om te kiezen. Daar begint een omgeving die mensen echt ondersteunt.",
      ],
      [
        "Probeer het voordat je alles verandert",
        "Je hoeft geen complete locatie te verbouwen om een andere dynamiek te creëren. Verplaats eens de ontvangst, begin een sessie staand of maak ruimte voor een korte wandeling. Vraag bezoekers achteraf welk moment hen hielp om verder te denken. Zo leer je stap voor stap welke elementen werkelijk iets toevoegen. Het mooiste ontwerp is uiteindelijk niet alleen wat goed oogt, maar wat een bijeenkomst beter laat verlopen.",
      ],
    ],
    slot: "Een ruimte is pas inspirerend wanneer mensen er iets durven te doen.",
  },
  "achter-de-schermen-bij-pulse-festival": {
    leestijd: "2 min lezen",
    intro:
      "Hoe bouw je een festival waar het programma en de beleving één verhaal vertellen?",
    secties: [
      [
        "Eén idee als kompas",
        "Voor de fictieve editie van Pulse Festival kozen we drie woorden: ontdekken, creëren, verbinden. Ze vormen het kompas voor elke keuze. Een sessie, installatie of ontmoeting moet ten minste één van die woorden waarmaken.",
      ],
      [
        "Begin met de bezoekersreis",
        "De eerste indruk ontstaat vóór de entree. De website, het programma en de bevestiging zetten verwachtingen neer. Op locatie loopt dat verhaal door in de ontvangst, bewegwijzering en de ruimte tussen de sessies.",
      ],
      [
        "Niet alles hoeft groter",
        "Een goed festival heeft niet voortdurend een hoogtepunt nodig. Soms is een klein gesprek waardevoller dan een volle zaal. Daarom wisselen in dit concept gezamenlijke momenten af met rustige plekken en kleinschalige workshops.",
      ],
      [
        "Geef het publiek een rol",
        "Mensen onthouden wat ze zelf hebben gedaan. Een vraag aan de zaal, een gezamenlijke installatie of een gesprek met een maker kan een programma verdiepen. Het is een subtiele verschuiving van consumeren naar deelnemen.",
      ],
      [
        "Een verhaal dat blijft bewegen",
        "Wanneer de laatste spreker het podium verlaat, begint eigenlijk het vervolg. Welke ideeën nemen bezoekers mee? Wie gaan elkaar opnieuw spreken? Het beste programma maakt ruimte voor dat volgende hoofdstuk.",
      ],
      [
        "De kleine beslissingen achter een groot geheel",
        "Een evenement bestaat uit honderden keuzes die bezoekers meestal niet bewust opmerken. De volgorde van sessies, de lengte van een pauze en de manier waarop je een zaal binnenkomt bepalen samen de sfeer. Voor Pulse Festival gebruiken we in de fictieve case steeds hetzelfde uitgangspunt: helpt dit mensen om te ontdekken, te maken of te verbinden? Zo krijgen zelfs praktische beslissingen een inhoudelijke reden.",
      ],
      [
        "Van programma naar persoonlijke route",
        "Niet iedereen komt voor hetzelfde. De ene bezoeker wil nieuwe kennis opdoen, de ander zoekt makers om mee samen te werken. Daarom bevat het programma verschillende soorten momenten. Naast keynotes zijn er kleine gesprekken, open installaties en rustige plekken. Iedereen kan zo een eigen route samenstellen, zonder het gevoel te hebben iets te missen. Dat maakt een rijk programma toegankelijker en aantrekkelijker.",
      ],
    ],
    slot: "Een festival is geslaagd als het niet alleen herinneringen, maar ook nieuwe plannen oplevert.",
  },
  "waarom-de-toekomst-menselijk-blijft": {
    leestijd: "2 min lezen",
    intro:
      "In een wereld die steeds digitaler wordt, groeit juist de waarde van menselijke aandacht.",
    secties: [
      [
        "Nieuwe middelen, oude vragen",
        "Technologie verandert de snelheid waarmee we informatie delen en plannen maken. Toch blijven belangrijke vragen hetzelfde: voelen mensen zich gezien, begrijpen ze elkaar en ontstaat er vertrouwen? Daar kan geen interface alleen voor zorgen.",
      ],
      [
        "Maak technologie dienstbaar",
        "Slimme systemen zijn waardevol wanneer ze ruimte vrijmaken voor betere keuzes. Minder tijd kwijt zijn aan herhalend werk betekent bijvoorbeeld meer tijd voor inhoud en gesprek. Die belofte vraagt wel om eerlijke verwachtingen en duidelijke verantwoordelijkheid.",
      ],
      [
        "Ontmoeting krijgt nieuwe betekenis",
        "Als informatie overal beschikbaar is, heeft een fysieke bijeenkomst een andere taak. Niet alleen kennis overbrengen, maar het gesprek op gang brengen dat online vaak ontbreekt. Dat vraagt om aandacht voor de inrichting, het programma en de mensen in de zaal.",
      ],
      [
        "Creativiteit is een teamvaardigheid",
        "Goede ideeën ontstaan wanneer verschillende mensen durven te reageren op elkaars werk. Dat vraagt om een omgeving waarin vragen stellen normaal is. De beste makers hebben niet overal direct een antwoord op, maar blijven nieuwsgierig.",
      ],
      [
        "De toekomst ontwerpen we samen",
        "De belangrijkste vraag is niet welke technologie morgen beschikbaar is. Het is wat we ermee willen verbeteren. Wie die vraag centraal stelt, houdt de mens in beeld.",
      ],
      [
        "De kunst van goed vragen stellen",
        "Wie met nieuwe technologie werkt, heeft niet alleen technische kennis nodig. Juist het vermogen om goede vragen te stellen wordt belangrijker. Voor wie is een oplossing bedoeld? Welk probleem lossen we eigenlijk op? Wat gebeurt er met de mensen die de verandering moeten gebruiken? Zulke vragen maken van een slimme toepassing een waardevolle toepassing. Ze beschermen ons ook tegen de neiging om alles te automatiseren omdat het nu eenmaal kan.",
      ],
      [
        "Vertrouwen ontstaat door duidelijkheid",
        "Mensen raken niet enthousiast van een systeem dat ze niet begrijpen of niet kunnen controleren. Transparante keuzes, begrijpelijke taal en een mogelijkheid om fouten te herstellen maken een groot verschil. Dat geldt voor organisaties, maar net zo goed voor digitale diensten. Goed ontwerpen betekent niet dat iedere bezoeker de techniek achter het product moet kennen. Wel dat duidelijk blijft wat iemand kan verwachten en waar de grenzen liggen.",
      ],
    ],
    slot: "Vooruitgang voelt pas waardevol wanneer mensen er samen beter van worden.",
  },
  "designing-for-tomorrow-begins-today": {
    leestijd: "2 min lezen",
    intro:
      "Een toekomstbestendig idee begint niet met voorspellen, maar met aandachtig ontwerpen.",
    secties: [
      [
        "Morgen is nooit helemaal voorspelbaar",
        "Een ontwerp moet vandaag bruikbaar zijn en morgen kunnen veranderen. Daarom is flexibiliteit niet alleen een technische eigenschap. Het is ook een manier van denken: maak keuzes die ruimte laten voor nieuwe inzichten.",
      ],
      [
        "Ontwerp met de mensen om wie het gaat",
        "Een mooie oplossing kan alsnog voorbijgaan aan wat gebruikers nodig hebben. Stel vragen, laat prototypes zien en luister naar de onverwachte reacties. Vaak schuilt daarin het belangrijkste signaal.",
      ],
      [
        "Maak complexiteit beheersbaar",
        "Grote ideeën worden pas uitvoerbaar als je ze in begrijpelijke onderdelen kunt opdelen. Een website is daar een goed voorbeeld van: een duidelijk design en een logisch beheersysteem versterken elkaar wanneer ieder onderdeel een eigen functie heeft.",
      ],
      [
        "Consistent zonder voorspelbaar te worden",
        "Een merk heeft regels nodig om herkenbaar te blijven. Maar binnen die regels kan volop variatie ontstaan. Hetzelfde geldt voor contentblokken. Ze geven structuur, terwijl vormgeving en combinaties ruimte houden voor een eigen verhaal.",
      ],
      [
        "Begin klein, maar denk zorgvuldig",
        "Een eerste versie hoeft niet alles te kunnen. Wel moet duidelijk zijn waarom ze bestaat. Bouw vanuit een scherpe kern en voeg mogelijkheden pas toe wanneer ze werkelijk iets bijdragen.",
      ],
      [
        "Durf onderdelen los te zien van het geheel",
        "Een flexibel ontwerp is opgebouwd uit elementen die hun functie kennen. Een artikel, projectkaart of uitnodiging moet afzonderlijk begrijpelijk zijn, maar ook passen in de bredere uitstraling van het merk. Dat maakt het makkelijker om nieuwe pagina’s samen te stellen en bestaande content opnieuw te gebruiken. Het voorkomt bovendien dat elke kleine wijziging een heel nieuw ontwerptraject vraagt. Structuur geeft daarmee juist vrijheid.",
      ],
      [
        "Blijf kijken na de lancering",
        "Een website, ruimte of ervaring is nooit helemaal af zodra deze wordt opgeleverd. Pas wanneer mensen haar gebruiken, ontdek je welke keuzes werken en waar ze vastlopen. Kijk naar reacties, test kleine verbeteringen en blijf vragen wat echt waarde toevoegt. De kunst is om het ontwerp herkenbaar te houden terwijl de inhoud meegroeit. Toekomstbestendigheid zit niet in één spectaculaire lancering, maar in het vermogen om te blijven leren.",
      ],
    ],
    slot: "De beste manier om klaar te zijn voor morgen, is vandaag iets te maken dat kan blijven groeien.",
  },
  "het-nieuwe-ontmoeten-is-persoonlijk": {
    leestijd: "2 min lezen",
    intro:
      "Waarom echte verbinding niet ontstaat door meer contacten, maar door betere ontmoetingen.",
    secties: [
      [
        "De waarde zit tussen de agendapunten",
        "Een bijeenkomst is meer dan een zorgvuldig programma. Vaak ontstaan de waardevolste gesprekken in de minuten ervoor of erna. Een goede organisator ontwerpt daarom niet alleen inhoud, maar ook ruimte om elkaar te ontmoeten.",
      ],
      [
        "Kleine gebaren maken verschil",
        "Een warm welkom, een helder bordje, een rustige plek of iemand die mensen aan elkaar voorstelt: het zijn kleine details met een groot effect. Gastvrijheid is geen extra laag over het programma, maar onderdeel van de ervaring.",
      ],
      [
        "Niet iedereen ontmoet op dezelfde manier",
        "Sommige mensen stappen gemakkelijk op een groep af. Anderen hebben eerst context nodig. Door verschillende gespreksvormen aan te bieden, maak je een bijeenkomst toegankelijker voor meer deelnemers.",
      ],
      [
        "Van netwerk naar gemeenschap",
        "Een netwerk bestaat uit contacten. Een gemeenschap ontstaat wanneer mensen elkaar opnieuw vinden en iets met elkaar delen. Dat kost tijd, aandacht en het lef om niet ieder moment vol te plannen.",
      ],
      [
        "Ontwerp voor het vervolg",
        "De beste vraag na een bijeenkomst is niet hoeveel visitekaartjes zijn uitgewisseld. Het is welke gesprekken worden voortgezet en welke nieuwe ideeën mensen samen oppakken.",
      ],
      [
        "Een goed welkom begint vóór de deur",
        "De toon van een bijeenkomst ontstaat vaak al bij de uitnodiging. Begrijpt iemand waarom hij welkom is, wat hij kan verwachten en hoe de dag eruitziet? Duidelijke communicatie neemt spanning weg en schept ruimte voor nieuwsgierigheid. Ook de website speelt hierin mee. Een programma, routebeschrijving en contactmogelijkheid hoeven niet ingewikkeld te zijn, maar moeten wel betrouwbaar en gemakkelijk te vinden zijn.",
      ],
      [
        "Geef ruimte aan onverwachte gesprekken",
        "Niet iedere minuut hoeft geprogrammeerd te zijn. Juist wanneer mensen even niets hoeven, ontstaan vaak de interessantste verbindingen. Organiseer daarom niet alleen de inhoud, maar ook het toeval: plekken waar mensen blijven staan, tafels waar nieuwe combinaties ontstaan en momenten waarop een goed gesprek niet meteen onderbroken wordt. Dan wordt een evenement meer dan een reeks sprekers. Het wordt een omgeving waar iets nieuws kan beginnen.",
      ],
    ],
    slot: "Betekenisvolle ontmoetingen beginnen bij de wens om iemand echt te leren kennen.",
  },
};

/** Artikel als platte hoofdtekst (voor Supabase/CMS): "## kop" + alinea's, gescheiden door lege regels. */
export function artikelAlsTekst(a: ArtikelTekst): string {
  return a.secties.map(([kop, tekst]) => `## ${kop}\n\n${tekst}`).join("\n\n");
}

// ---------- Ruimtes ----------
export type RuimteDetail = {
  payoff: string;
  intro: string;
  alineas: string[];
  kenmerken: string[];
  capaciteit: string;
  knop: string;
};

export const ruimteDetails: Record<string, RuimteDetail> = {
  "the-atrium": {
    payoff: "Daglicht verandert alles.",
    intro:
      "Grote ramen, een groene omgeving en alle ruimte om samen te komen. The Atrium voelt open, rustig en uitnodigend.",
    alineas: [
      "The Atrium is een fictieve voorbeeldlocatie voor bijeenkomsten waarin mensen centraal staan. De ruimte combineert daglicht en een warme uitstraling met een flexibele inrichting.",
      "Van een plenaire presentatie tot een informele netwerkbijeenkomst: de indeling beweegt mee met de dag. Een centrale ontvangst, rustige hoeken en open zichtlijnen zorgen ervoor dat gasten zich snel thuis voelen.",
      "In het demo-CMS laat The Atrium zien hoe je kenmerken, beelden en aanvraagmogelijkheden van een locatie op één plek beheert.",
    ],
    kenmerken: [
      "Veel natuurlijk licht",
      "Flexibele opstellingen",
      "Ruimte voor presentaties en ontmoeting",
      "Geschikt voor creatieve en zakelijke sessies",
    ],
    capaciteit: "50–500 personen (fictief voorbeeld)",
    knop: "Bekijk beschikbaarheid (demo)",
  },
  "studio-one": {
    payoff: "Grote ideeën beginnen in kleinere ruimtes.",
    intro:
      "Een plek om te denken, te schetsen, iets te proberen en weer opnieuw te beginnen. Studio One is bewust flexibel ingericht.",
    alineas: [
      "Studio One is een fictieve ruimte voor teams die samen verder willen komen. Met een heldere basis, verplaatsbare inrichting en rustige uitstraling past de locatie zich aan de bijeenkomst aan.",
      "Een halve dag brainstormen, een compacte presentatie of een intensieve workshop: het programma bepaalt hoe de ruimte wordt gebruikt. Maak een keuze in de demo-configurator en bekijk hoe een indicatieve prijs kan worden opgebouwd.",
      "Er is geen echte kalender of reserveringssysteem gekoppeld. Aanvragen en tijdsloten zijn uitsluitend voorbeelden van de gebruikerservaring.",
    ],
    kenmerken: [
      "Flexibele tafels en stoelen",
      "Presentatie- en workshopopstelling",
      "Lichte, rustige sfeer",
      "Aanpasbaar programma",
    ],
    capaciteit: "10–60 personen (fictief voorbeeld)",
    knop: "Stel je sessie samen",
  },
  "light-lab": {
    payoff: "Stap buiten het verwachte.",
    intro:
      "Soms helpt een andere omgeving om een totaal nieuw gesprek te voeren. In Light Lab krijgt elk idee zijn eigen podium.",
    alineas: [
      "Light Lab is een fictieve creatieve ruimte voor merken, makers en teams die buiten de gebruikelijke vergaderzaal willen werken. De sfeer verandert met licht, projectie en indeling.",
      "De ruimte leent zich in deze voorbeeldwereld voor lanceringen, kleine exposities en bijzondere presentaties. Van een stille introductie tot een energiek gezamenlijk moment: de ruimte ondersteunt het verhaal.",
      "De technische mogelijkheden zijn illustratief en moeten bij echte locaties altijd afzonderlijk worden bevestigd.",
    ],
    kenmerken: [
      "Veranderbare lichtsfeer",
      "Geschikt voor presentaties en activaties",
      "Opvallende visuele setting",
      "Ruimte voor experiment",
    ],
    capaciteit: "20–120 personen (fictief voorbeeld)",
    knop: "Ontdek de mogelijkheden",
  },
};

export const ruimteDemolabel =
  "Fictieve ruimte. Beschikbaarheid, prijs en aanvragen zijn illustratief.";

// ---------- Evenementen ----------
export type Evenement = {
  slug: string;
  naam: string;
  eyebrow: string;
  payoff: string;
  intro: string;
  datum: string;
  locatie: string;
  doelgroep: string;
  dagen: Array<{ titel: string; items: Array<[string, string]> }>;
  tickets: Array<[string, string, string]>;
  disclaimer: string;
  beeld: string;
};

export const evenementen: Evenement[] = [
  {
    slug: "pulse-festival",
    naam: "Pulse Festival",
    eyebrow: "NOVA BELEVINGEN / DEMO-EVENEMENT",
    payoff: "Voel de toekomst vorm krijgen.",
    intro:
      "Drie dagen vol creativiteit, cultuur en technologie. Laat je verrassen door frisse perspectieven, eigenzinnige makers en ontmoetingen die blijven hangen.",
    datum: "12–14 september 2027 (fictief)",
    locatie: "NOVA Campus (fictief)",
    doelgroep: "Makers en vernieuwers",
    beeld: "event_lights",
    dagen: [
      {
        titel: "Dag 1 — Ontdekken",
        items: [
          ["10.00", "Opening: de wereld verandert"],
          ["11.15", "Ontwerpen voor morgen"],
          ["13.30", "Belevingen voorbij het scherm"],
          ["16.00", "Ontmoet de makers"],
        ],
      },
      {
        titel: "Dag 2 — Creëren",
        items: [
          ["10.00", "Lab voor creatieve toekomsten"],
          ["11.30", "Workshop: van idee naar beleving"],
          ["14.00", "Samen bouwen"],
          ["16.15", "Open studiogesprekken"],
        ],
      },
      {
        titel: "Dag 3 — Verbinden",
        items: [
          ["10.30", "De menselijke kant van technologie"],
          ["12.00", "Communitylunch"],
          ["14.00", "Ideeën die het delen waard zijn"],
          ["16.30", "Slotgesprekken"],
        ],
      },
    ],
    tickets: [
      ["Dagkaart", "€ 49", "Eén dag programma en toegang tot de expo."],
      [
        "Volledig festival",
        "€ 119",
        "Alle drie de dagen en alle algemene sessies.",
      ],
      [
        "Makerspas",
        "€ 189",
        "Volledig programma en een extra kleinschalige workshop.",
      ],
    ],
    disclaimer:
      "Fictief evenement, fictieve datum, fictieve prijzen. Geen kaartverkoop.",
  },
  {
    slug: "nova-sessions",
    naam: "NOVA Sessions",
    eyebrow: "NOVA BELEVINGEN / DEMOSERIE",
    payoff: "Andere mensen. Betere vragen.",
    intro:
      "Een compacte serie ontmoetingen voor nieuwsgierige makers. Korte talks, scherpe vragen en gesprekken die na afloop doorgaan.",
    datum: "21 oktober 2027 (fictief)",
    locatie: "Studio One (fictieve ruimte)",
    doelgroep: "Nieuwsgierige makers",
    beeld: "journal_event",
    dagen: [
      {
        titel: "Programma",
        items: [
          ["15.00", "Welkom en ontmoeting"],
          ["15.30", "Talk: ontwerp voorbij het scherm"],
          ["16.00", "Open gesprek: wat komt hierna?"],
          ["17.00", "Afsluiting en ontmoetingen"],
        ],
      },
    ],
    tickets: [["Sessieplek", "€ 19", "Toegang tot de sessie en het gesprek."]],
    disclaimer: "Voorbeeldevenement; geen live registratie of kaartverkoop.",
  },
];

// ---------- Mensen, sprekers, partners, citaten ----------
export const bios: Record<string, { kort: string; lang: string }> = {
  "Maya Chen": {
    kort: "Maya verbindt ideeën, beeld en gevoel. Ze zoekt naar het bijzondere in alledaagse vragen.",
    lang: "Bij NOVA onderzoekt Maya hoe een ontwerp mensen iets kan laten voelen. Ze gelooft in scherpe keuzes, duidelijke verhalen en genoeg ruimte voor het onverwachte. Ze is een fictief teamlid in deze CMS-demonstratie.",
  },
  "Noah Vermeer": {
    kort: "Noah denkt in routes, ritme en ontmoetingen. Voor hem is een ervaring pas geslaagd als bezoekers zelf iets ontdekken.",
    lang: "Noah vertaalt ideeën naar programma’s en ruimtelijke beleving. Van eerste ontvangst tot laatste gesprek kijkt hij naar het geheel. Noah is een fictief profiel.",
  },
  "Amara Brooks": {
    kort: "Amara stelt graag de vraag achter de vraag. Daar vindt ze vaak het begin van een beter idee.",
    lang: "Amara combineert onderzoek en creativiteit. Ze zoekt naar de verbinding tussen behoeften, merkverhaal en vorm. Dit is een fictief demoprofiel.",
  },
  "Luca Moreno": {
    kort: "Luca brengt mensen samen die elkaar anders misschien nooit hadden ontmoet.",
    lang: "Luca bouwt ontmoetingen met aandacht voor sfeer, toegankelijkheid en oprechte nieuwsgierigheid. Luca is een fictieve maker voor de NOVA-website.",
  },
};

export const sprekers: Record<string, string> = {
  "Maya Chen": "Ontwerpen voor morgen",
  "Noah Vermeer": "Belevingen voorbij het scherm",
  "Amara Brooks": "De menselijke kant van technologie",
  "Luca Moreno": "Betere vragen, sterkere gemeenschappen",
};

export const partners: Array<[string, string, string]> = [
  [
    "Atelier North",
    "Ruimtelijk ontwerp",
    "Fictieve ontwerpstudio die architectuur, licht en menselijke beleving bij elkaar brengt.",
  ],
  [
    "Common Ground Lab",
    "Community & onderzoek",
    "Fictief collectief dat nieuwe manieren van samenwerken onderzoekt.",
  ],
  [
    "Signal Works",
    "Technologie & media",
    "Fictieve creatieve technologiestudio met liefde voor eenvoudige, heldere toepassingen.",
  ],
  [
    "Future Fields",
    "Cultuur & educatie",
    "Fictieve programmapartner die nieuwsgierigheid en nieuwe perspectieven stimuleert.",
  ],
];

export const citaten: Array<[string, string]> = [
  [
    "Er ontstaat hier ruimte voor ideeën die nergens anders passen.",
    "Maya Chen",
  ],
  ["De energie van samen iets maken is ongeëvenaard.", "Noah Vermeer"],
  [
    "Je komt voor een evenement en vertrekt met een nieuw perspectief.",
    "Amara Brooks",
  ],
];

// ---------- Veelgestelde vragen over Link & Lead One ----------
export const faq: Array<[string, string]> = [
  [
    "Wat is Link & Lead One?",
    "Link & Lead One is het CMS-platform achter de NOVA-demonstratie. Het is bedoeld om websites via vaste contentblokken, collecties en site-instellingen beheersbaar te maken. Welke onderdelen in de actuele installatie werken, wordt in de technische demo gecontroleerd.",
  ],
  [
    "Is NOVA een echte organisatie?",
    "Nee. NOVA is een fictief creatief merk dat speciaal is ontworpen om de vormgeving en mogelijkheden van Link & Lead One te demonstreren. De projecten, personen, evenementen en locaties zijn voorbeelden.",
  ],
  [
    "Kan iedere website er anders uitzien?",
    "Ja, binnen de beschreven werkwijze is per site een eigen huisstijl mogelijk. Met een eigen frontend is bovendien veel meer ontwerpvrijheid mogelijk dan bij een vaste renderer.",
  ],
  [
    "Hoeveel algemene blokken zijn er?",
    "De CMS-ontwerpspecificatie beschrijft 43 algemene blokken. Daaronder vallen onder meer headers, tekst met beeld, cases, artikelen, team, formulieren, configurators en prijskaarten.",
  ],
  [
    "Wat kan ik zelf aanpassen?",
    "Afhankelijk van het blok kun je bijvoorbeeld koppen, teksten, afbeeldingen, knoppen, lijsten, varianten en achtergronden beheren. Welke velden beschikbaar zijn, verschilt per blok.",
  ],
  [
    "Wat zijn collecties?",
    "Collecties zijn verzamelingen contentitems, zoals artikelen, projecten, teamleden, partners of reviews. De website kan items op meerdere plekken presenteren vanuit dezelfde bron.",
  ],
  [
    "Kan ik zelf de kleuren en lettertypes kiezen?",
    "In de specificatie staan twaalf benoemde kleurvelden, twee lettertypen en de mogelijkheid om eigen webfonts te hosten. De exacte uitvoering hangt af van de ingestelde site.",
  ],
  [
    "Kan ik formulieren maken?",
    "De algemene blokkenbibliotheek bevat formulieren, een formulierbouwer, reviews verzamelen en NPS. De verzending, opslag en eventuele koppelingen moeten in een echte installatie technisch worden ingericht.",
  ],
  [
    "Werkt de configurator echt?",
    "NOVA laat een visuele configurator zien met voorbeeldkeuzes en een indicatieve prijs. De demo is geen echte offerte, betaling of reservering. De onderliggende CMS-specificatie kent wel een configuratorblok.",
  ],
  [
    "Kan ik een website op mobiel beheren of bekijken?",
    "De NOVA-website is ontworpen voor mobiel en desktop. Of alle beheerfuncties op mobiel beschikbaar zijn, moet in de concrete CMS-versie worden gecontroleerd.",
  ],
  [
    "Is de website direct klaar voor gebruik?",
    "De NOVA-website is in deze fase een ontwerp- en bouwdemo. Voor livegebruik zijn een geverifieerde CMS-koppeling, echte content, privacygegevens en werkende formulieren nodig.",
  ],
  [
    "Is er ook een ledenomgeving mogelijk?",
    "De blokkenbibliotheek kent Ledentoegang. NOVA demonstreert de visuele inlogervaring. Echte accounts, toegangsrechten en authenticatie zijn in deze demo niet geactiveerd.",
  ],
  [
    "Kan ik meerdere sites met verschillende merken gebruiken?",
    "De specificatie beschrijft huisstijl per site en twee manieren om frontends te bouwen. Of één specifieke installatie alle gewenste sites en gebruikersrollen ondersteunt, moet eerst in de CMS-omgeving worden vastgesteld.",
  ],
  [
    "Heeft Link & Lead One ingebouwde AI?",
    "Dat valt niet af te leiden uit de CMS-blokkenspecificatie. We tonen in NOVA geen AI-functie als werkend product zonder verificatie van de daadwerkelijke implementatie.",
  ],
  [
    "Hoe vraag ik een demo aan?",
    "Ga naar Contact en kies “Demonstratie van Link & Lead One”, of gebruik het aanvraagformulier onderaan de pagina Het CMS.",
  ],
];

// ---------- Alt-teksten ----------
export const altTeksten: Record<string, string> = {
  hero_arch:
    "Monumentale blauw verlichte boogarchitectuur met warm oranje licht en een wandelende figuur.",
  work_color:
    "Meeslepende installatie met oranje, paarse en blauwe lichtbanen en bezoekers.",
  work_arch:
    "Strakke moderne architectuur met geometrische vlakken en zonlicht.",
  work_beige:
    "Minimalistische architectuur in lichte zandkleur en scherpe lijnen.",
  work_person: "Creatief persoon in een eigentijdse, grafische omgeving.",
  journal_face:
    "Portret van een creatieve vrouw in een oranje outfit tegen een blauwe achtergrond.",
  journal_arch: "Modern architecturaal detail in zacht daglicht.",
  journal_event:
    "Bezoekers tijdens een creatieve bijeenkomst met gekleurd licht.",
  journal_person: "Portret in een redactionele, eigentijdse fotografiestijl.",
  event_lights: "Publiek kijkt naar een podium met paarsblauwe lichtstralen.",
  event_gradient: "Abstracte lichtbanen in magenta, blauw en violet.",
  space_atrium:
    "Ruim licht atrium met grote ramen, planten en warme zithoeken.",
  comm_face: "Portret van een maker met een rustige, zelfbewuste uitstraling.",
  comm_man: "Portret van een creatieve professional met bril.",
  comm_person: "Portret van een jonge maker tegen een zachte achtergrond.",
  comm_event: "Mensen komen samen bij een creatieve bijeenkomst.",
  comm_arch: "Architecturaal detail met lichte vormen en moderne materialen.",
};
