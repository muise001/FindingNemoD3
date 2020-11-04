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

deze transitie bleek gelukkig makkelijker dan verwacht. Later heb ik ook de naam toegevoegd van het personage die het de zin in kwestie zegt. Dit had ik nodig om de bolletjes goed te alignen met de y-as. De totalLinesByCharacter heb ik later toegevoegd om de kleur van de bolletjes te berekenen

```javascript
const allLinesWithNamesData = []

Object.entries(data).forEach(characterObj => {
    characterObj[1].scentance.map(scentance => {
        allLinesWithNamesData.push({
            ...scentance, 
            name: characterObj[0],                                      // Added later in the process
            totalLinesByCharacter: characterObj[1].scentance.length})   // Added later in the process
        })
    })
```

als x.domain had ik in de eerste instantie `x.domain(0, allLinesWithNamesData.length - 1)`. Later leg ik uit waarom dit niet de beste manier was.

### De bolletjes

Nadat de x- en y-as getoond werden, kon ik dan aan de bolletjes beginnen. Dit was vrij makkelijk aangezien ik nu de data op een andere manier had geparsed. 

```javascript
const circles = g.selectAll("circle")
       .data(allLinesWithNamesData, d => d.lineNumber)
       
circles.enter().append("circle")
    .attr("cx", d => x(d.lineNumber))
    .attr("cy", d => y(d.name))
    .attr("r", "3")
```
Dit resulteerde in de onderstaande data-visualisatie.

![versie 0.1](https://github.com/muise001/FindingNemoD3/blob/main/foto's/v0.1.jpeg)

## Bigger and Better
Nu alles op het scherm stond ben ik terug gegaan naar de tekentafel. Er was een hoop goed, maar er was misschien wel meer verkeerd. Ik heb een lijstje gemaakt van wat ik nog wilde toevoegen. Zie het lijstje hieronder: 

**Done**
- [x] Tooltip
- [x] De bolletjes moeten kleuren krijgen
- [x] X-as moet scenes weergeven en geen nietszeggende getallen
- [x] Selecteren van een of meerdere scenes
- [x] x-as sluit niet aan op y-as

**To do / Not doing**
- [ ] Data vergelijken met "Finding Dory" (de vervolgfilm van finding Nemo)

### Tooltip
Als eerste wilde ik een tooltip toevoegen. Dit is een makkelijke en een van de beste manieren om van je statische grafiek iets interactiefs te maken. 

Als eerste heb ik een div gegenereerd met een aantal style attributen (deze laat ik niet zin in de regel hieronder, anders is de pagina vol).

`const tooltip = d3.select("body").append("div").attr("class", "tooltip")`

Daarna geef ik de circels twee events. De ene om te kijken of de cursor er overheen hovered. De ander om te kijken of de muis er inmiddels niet meer overheen hovered. Dat doe je door na de `circels.enter().append("circles")` het volgende "attribute" toe te kennen. 

```javascript
circles.enter().append("circles")
  .on("mouseover", d => {           // Hier kijk je of de cursor over een cirkel heen hovered
     hoverlineSettings(d, "enter")  // Over deze functie ga ik het straks hebben
     tooltip.html(`
       <p>${d.line}</p>
       <ul>
          <li>said by: ${d.name}</li>
          <li>scene: ${d.scene}</li>
       </ul>
     `)
     .style("left", (d3.event.pageX) + "px")      // Zet de tooltip neer naast je muis
     .style("top", (d3.event.pageY) + 5 + "px")   
  })
  .on("mouseout", () => {          // Hier kijk je of de cursor gestopt is met hoveren
      hoverLineSettings("remove")
      tooltip.style("opacity", 0)
  })
```

Deze bovenstaande code is genoeg om de eerder aangemaakte tooltip te tonen. de `d3.event.pageX` geeft de huidige locatie aan van je cursor. Zo kan je de tooltip gemakkelijk naast je cursor tonen.

Ook wilde ik dat er lijnen naar het geselecteerde balletje lopen vanuit de gehele x-as. Dit wil ik, zodat je makkelijk kan zien welk personage aan het praten is en tegen wie hij praat. Daar heb ik de functie hoverLineSettings voor aangemaakt. Dit heb ik in een aparte functie gedaan omdat de functie van de circels anders te lang werd. 

```javascript
const hoverLine = graphScreen.append("g") 

if(state === "enter"){

        // Onderstaande lijn loopt van de y-as op de hoogte van het personage 
        // naar her personage (een horizontale ljin, dus)
        hoverLine.append("path")
        .attr("class", "tooltipLine")
        .attr("d", d3.line()([[0, y(d.name)], [x(d.lineNumber), y(d.name)]])) 
        .style("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 5)

        // Onderstaande lijn loopt van de x-as recht omhoog door het balletje
        hoverLine.append("path")
        .attr("class", "tooltipLine")
        .attr("d", d3.line()([[x(d.lineNumber), 0], [x(d.lineNumber), HEIGHT]]))
        .style("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 5)
    } else {
        hoverLine.selectAll("path").remove()
    }
```

Ik weet niet of dit de reguliere manier is om een tooltip-hulp-lijn toe te voegen, maar het werkt.

### Gekleurde bolletjes
Ik wilde wat meer kleur geven aan mijn grafiek en het onderscheid tussen de bolletjes wat groter maken. Ik heb op internet een kleuren-schema gevonden en deze gehanteerd. Het probleem is, dat toen ik dit kleurenschema ging toepassen, iedereen behalve Dory, Marley en Nemo dezelfde kleur was. Dit kwam omdat ik de kleur liet komen vanuit een lineaire schaal genereerde. Maar er zijn maar weinig personages die meer dan 20 zinnen zeggen. (fun fact: Marley zegt er 372). Dit betekende dat ik mijn schaal moest aanpassen.

```javascript 
// Initialisatie
const colorGradient = ["255,235,204", "187,220,205", "153, 203, 205", "120, 188, 207", "97,168,202", "83,143,186", "69,118,169", "56,94,153", "43,68,138", "30,45,122", "23,33,97", "17,24,72"]

const gradientScale = d3.scaleLog()

// Na update functie
gradientScale.domain([1, 372]).range([0, colorGradient.length -1])
```

Met deze schaal raakte ik echt de "sweet-spot". Dit resulteerd in een ten eerste leuker-uitziende grafiek, maar ook wordt de grafiek hier overzichtelijker van. 

De reden dat 372 hardcoded is, is omdat Marley (degene die de meeste zinnen zegt) niet in alle scenes voorkomt. Ook wil ik niet elke keer dat de grafiek wijzigd deze schaal wijzigen, omdat deze logaritmisch is. Dit kan resulteren in hele saaie, onherkenbare kleuren na het inzoomen.

Nu alleen de kleur nog toepassen en klaar 
```javascript
.attr("fill", d => `rgb(${colorGradient[Math.round(gradientScale(d.totalLinesByCharacter))]})`)
```

### x-as moet scenes weergeven
Regelnummers uit het script zijn nietszeggend. Ik wil dat het in een oogopslag duidelijk wordt in welke scene iemand zich begeeft. Dus wat ik wilde is 
  - x-as ticks moeten scenes weergeven
  - x-as ticks moeten zo lang worden dat er een grid ontstaat
  
Als eerste de scenes als ticks.
Aangezien het niet erg populair is om een niet-symmetriche x-as te gebruiken, was het vrij lastig om uit te zoeken hoe ik dit zou fixen. met behulp van (deze bron)[https://observablehq.com/@d3/axis-ticks] heb ik uiteindelijk het probleem opgelost.

```javascript
const sceneCoordinates = {
    lineNumber: [], 
    scene: []
}

allLinesWithNamesData.sort((a, b) => a.lineNumber - b.lineNumber)
    .forEach((data, i) => {
      if (data.scene === currentScene) {
          sceneCoordinates.lineNumber.push([data.lineNumber])
          sceneCoordinates.scene.push([data.scene])
          currentScene++
          return
      } else {
        return
      }
})   

const xAxisCall = d3.axisBottom(x)
    .tickValues(sceneCoordinates.lineNumber)
    .tickFormat((d, i) => sceneCoordinates.scene[i])
```

### Selecteren van een of meerdere scenes
Natuurlijk wilde ik de grafiek ook spannender maken. Ik wilde dat het mogelijk werd om scenes te ontdekken door ze van dichterbij te kunnen bekijken. Ook wilde ik dat je door de hele film kon klikken als je bijvoorbeeld maar één scene had geselecteerd (dus dat je van scene 1 naar scene 2 gaat etc.).

Eerst wilde ik een range-slider toevoegen. Maar wegens slechte ervaringen met range sliders (en jQuerry), besloot ik om de scene-nummers van de x-as te gebruiken als range-slider. Het idee is dat je eerst klikt op een scene, daarna een andere scene en dat de grafiek daarna inzoomed naar aanleiding van je selectie.

Ik heb een event toegevoegd op `d3.selectAll(".x.axis .tick text")`. Deze roept de functie sceneFilter aan. Deze kijkt of het :
  1. je eerste klik is
  2. of je op hetzelfde klikt als vorige keer
  3. of je twee unieke kliks hebt
  
Als je voor het eerste klikt, dan wordt de text van de tick van x-as groter en een andere kleur. Ook wordt de functie `startSelection` aangeroepen. Deze tekent een lijn vanaf het punt op de x-as van waar je op klikte, recht omhoog. als je nu hovered over een andere x-as tick, dan kan je heel duidelijk zien  

sources custom tick values x-axis : https://observablehq.com/@d3/axis-ticks

tick grid : https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218

scale issue that took serveral hours : 
https://stackoverflow.com/questions/49154717/d3-js-x-axis-disappears-when-i-set-the-y-axis-domain-to-have-a-minimum-greater
https://stackoverflow.com/questions/46942134/svg-translate-group-positioning-on-window-resize-with-d3
https://groups.google.com/g/d3-js/c/T9l5SN0-66c?pli=1
