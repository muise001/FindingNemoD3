# Finding Nemo D3 Data Visualisatie

[Klik hier om de website te zien](https://muise001.github.io/FindingNemoD3/Finding%20Nemo%20data%20visualisatie/)

## Intro

Afgelopen maanden heb ik een online cursus gevolgd over D3. Dit deed ik zodat ik een beter begrip kreeg in D3 en meer kon bereiken dan alleen het knippen-en-plakken van bestaanden grafieken. Ik wilde het mogelijk maken om mijn eigen creativiteit uit te drukken in grafieken en daar had ik deze kennis voor nodig, anders was ik voor altijd gelimiteerd aan bestaand werk.

De cursus die ik heb gevolgd is "Mastering data visualization in D3.js [2020 UPDATE]" op Udemy.

In de loop van dan deze cursus heb ik meerdere notitieboekjes volgeschreven met kleine cheatsheets en handige tips.

Tijdens deze cursus heb ik geleerd hoe je barcharts, bolletjes grafieken en line-charts maakt. in D3 v5

### Voorbeelden
Screenshots van vorige opdrachten

## Finding Nemo

Omdat ik een grafiek wilde maken zonder politieke-lading, denk aan "co2 uitstoot per persoon per land vs bruto nationaal product". Koos ik voor iets luchtigs en leuks. Ik kwam op het idee om een filmscript te ontleden en daar data uit te halen. Ik heb een lijstje gemaakt van een aantal dingen die je uit film scripts kan halen.

- Aantal woorden (totaal film)
- Aantal personages
- Aantal woorden per personage
- Aantal Scenes
- Aantal zinnen per personage
- Favoriete woorden per personage
- Favoriete woorden algemeen

### Data Set
Ik kwam op een website genaamd [imsdb.com](imsdb.com). Hier bieden ze van waanzinnig veel films film scripts aan. Het enige probleem, is dat bij veel film scripts ook bepaalde settingen in scenes worden behandeld. Denk aan "Personage 1 zat met z'n handen in z'n haren. De zon ging onder. Op de achtergrond is het mistig". Dit maakt het moeilijk om een parser te maken. Toen stuitte ik op het filmscript van [Finding Nemo](https://www.imsdb.com/scripts/Finding-Nemo.html). Deze was geschreven door een fan en had alleen: 

  1. Scenenummers
  2. Personages
  3. Zinnen
  
Dit was percies wat ik nodig had. Ik heb het filmscript volledig ge-copy-paste naar een .txt bestand en heb een aantal kleine dingen bewerkt in dit bestand.
  1. Alle enters eruit
  2. Alle "===================" (wat waarschijnlijk aangeeft dat er een switch van locatie is) eruit
  3. Alle scene-nummers veranderd naar `__Scene[nummer]__` zodat dit makkelijk te vinden was vanuit javascript.
  
  Hieronder een foto van de rouwe data na bovenstaande wijzigingen
  
  ![rouwe data](https://github.com/muise001/FindingNemoD3/blob/main/foto's/Schermafbeelding%202020-11-04%20om%2015.05.24.png)  
  
Toen ben ik begonnen met het maken van mijn parser. Ik wilde dat mijn code er als volgt uit kwam te zien

```javascript
  data: {
    [Naam]: {
      scentance: [{
        line: "Bla bla bla",
        scene: 2,
        lineNumber: 18,
      }]
    }  
  }
```

De reden dat ik het zo wilde is dat ik gemakkelijk kon zien hoeveel characters er waren en per character dan de zinnen kon vertonen en uitlezen.

In de code begon ik met het fetchen van de dataset.
Per zin keek ik of de zin begon met `__Scene`. Zo ja, dan wist ik dat alles wat daarna kwam tot die scene behoorde. Daarna keek ik per zin of de zin begon met twee hoofdletters. Als ik dat wist, dan wist ik dat het hier ging om een personage, en dan wist ik dat wat hierna gezegd was, vanuit dit personage kwam. Alle hieropvolgende regels die niet OF een personage OF een `__Scene__` was, werd toegoegd aan de vorige zin. Het kan namelijk voorkomen dat iemand een hele lange zin zegt die verdeeld is over drie regels. Het regelnummer wist ik, omdat ik over de data heen loop en gemakkelijk het variabele `i` kon gebruiken.

Uiteindelijk heeft mijn parser het voor elkaar gekregen om deze data naar wens te vertonen
![De bruikbare data](https://github.com/muise001/FindingNemoD3/blob/main/foto's/Schermafbeelding%202020-11-04%20om%2015.07.01.png)
  
### Het Design
Nu ik de data had ging ik nadenken wat ik ermee wilde doen. Ik had eerder al een lijstje bedacht, maar had geen zin om bar-charts te maken. Die zijn vaak simpel en weinig uitdagend. Uiteindelijk kwam ik met hetvolgende design: 

![design schets](https://github.com/muise001/FindingNemoD3/blob/main/foto's/design.png)

Dit leek me een goed design, aangezien je een duidelijk overzicht hebt van alle personages, alle scenes, dialogen, het verloop van de film en je kan er locatie-changes uit aflezen als opeens twee compleet verschillende mensen met elkaar gaan praten. 

## Versie 0.1.
Als eerst wilde ik het design exact namaken. Dan had ik namelijk de essentie van de visualisatie al op beeld en kon ik later natuurlijk verder uitbouwen.

### De setup
Als eerst heb ik de data ge-fetched. Deze door de parser heen laten lopen en vervolgens verstuurd naar de hoofd functie genaamd "update". In de update functie console.log'de ik alleen nog de data. Daar gebeurde verder niks mee. 

Daarna ben ik een tekengebied gaan maken. Ik heb constanten aangemaakt die de afmetingen en de marges van het tekenveld moesten hebben en deze ingeladen met d3.

```javascript
const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
```

### De x- en y-as 
Als eerste ben ik de y-as gaan maken. Deze leek me makkelijker dan de x-as, omdat ik hier niet met nummerieke data, maar met namen werkte. Dit werkte in de eerste instantie niet zo geweldig, omdat ik niet wist hoe je een as-maakte met niet-nummerieke data. met wat hulp van (Mike Bostock)[https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3] en een (andere bron)[https://observablehq.com/@d3/d3-scaleordinal], heb ik de y-as uit eindelijk gefixt. De eerste bron hielp wel met begrijpen wat er moest gebeuren, alleen was de code out-dated. Hij werkte met d3 v3 en ik met d3 v5. In v5 is een groot gedeelte van de syntax ingekort. In v3 schreef je bijvoorbeeld `d3.scale.ordinal()` en in v5 `d3.scaleOrdinal()`. Goed om te weten. Uiteindelijk heb ik een (hele goede bron)[https://www.d3-graph-gallery.com/graph/custom_axis.html] gevonden die uitlegd welke scale je het beste kan gebruiken bij welke case en dat bleek `d3.scaleBand()` te zijn. 

De `y.range([0, HEIGHT])` gaf ik natuurlijk gewoon de hoogte van het scherm en het `domain` kon ik schrijven als `y.domain(Object.keys(data))`. Object.keys(data) geeft - in dit geval - alle namen van alle characters terug als array. 

De x-as was een ander verhaal. Omdat mijn data was vormgegeven op de manier waarop het was vormgegeven, kon ik heel moeilijk alle zinnen van alle personages inzien in chronologische volgoorde, omdat ze verdeeld waren onder de naam van het personage. Wat ik hier dus nodig had was data die er als volgt uit ziet: 
```javascript
  [{line: "bla, bla", lineNumber: 4, scene: 2} {line: "bla, bla", lineNumber: 5, scene: 2}]
```

deze transitie bleek gelukkig makkelijker dan verwacht. Later heb ik ook de naam toegevoegd van het personage die het de zin in kwestie zegt. Dit had ik nodig om de bolletjes goed te alignen met de y-as. De totalLinesByCharacter heb ik later toegevoegd om de kleur van de bolletjes te bekijken

```javascript
Object.entries(data).forEach(characterObj => {
    characterObj[1].scentance.map(scentance => {
        allLinesWithNamesData.push({
            ...scentance, 
            name: characterObj[0],                                      // Added later in the process
            totalLinesByCharacter: characterObj[1].scentance.length})   // Added later in the process
        })
    })


![versie 0.1](https://github.com/muise001/FindingNemoD3/blob/main/foto's/v0.1.jpeg)

sources custom tick values x-axis : https://observablehq.com/@d3/axis-ticks

tick grid : https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218

scale issue that took serveral hours : 
https://stackoverflow.com/questions/49154717/d3-js-x-axis-disappears-when-i-set-the-y-axis-domain-to-have-a-minimum-greater
https://stackoverflow.com/questions/46942134/svg-translate-group-positioning-on-window-resize-with-d3
https://groups.google.com/g/d3-js/c/T9l5SN0-66c?pli=1
