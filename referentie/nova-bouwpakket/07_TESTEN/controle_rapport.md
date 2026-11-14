# Verificatie van de overdracht

- JavaScript-syntax is gecontroleerd met `node --check` voor de twee losse scripts.
- Alle 18 pagina-templates zijn via een lokale Node-VM geëvalueerd; de sectie-HTML is geëxtraheerd.
- Browser-rendering van de nieuwe promotiepagina kon in deze runtime niet worden uitgevoerd. Deze visuele verificatie moet Claude Code lokaal herhalen.
- De oorsprongswebsite is al als zelfstandig HTML-bestand aanwezig; de refactor is een technische ontvlechting van CSS, JS en afbeeldingen, en de nieuwe route `/one` is een aanvulling.
- De 43 namen komen uit het aangeleverde PDF. Elke block-preview in het huidige prototype is *illustratief*, behalve waar een werkende implementatie na repo-audit bewezen wordt.
