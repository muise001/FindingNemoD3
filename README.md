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
  
  ![rouwe data](https://github.com/muise001/FindingNemoD3/blob/main/foto's/Schermafbeelding%202020-11-04%20om%2015.05.24.png)
  
Dit was percies wat ik nodig had. Ik heb het filmscript volledig ge-copy-paste naar een .txt bestand en heb een aantal kleine dingen bewerkt in dit bestand.
  1. Alle enters eruit
  2. Alle "===================" (wat waarschijnlijk aangeeft dat er een switch van locatie is) eruit
  3. Alle scene-nummers veranderd naar `__Scene[nummer]__` zodat dit makkelijk te vinden was vanuit javascript.
  
Toen ben ik begonnen met het maken van mijn parser.

  
### Het Design

sources y-axis: https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3 (outdated)
                https://observablehq.com/@d3/d3-scaleordinal

sources custom tick values x-axis : https://observablehq.com/@d3/axis-ticks

tick grid : https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218

scale issue that took serveral hours : 
https://stackoverflow.com/questions/49154717/d3-js-x-axis-disappears-when-i-set-the-y-axis-domain-to-have-a-minimum-greater
https://stackoverflow.com/questions/46942134/svg-translate-group-positioning-on-window-resize-with-d3
https://groups.google.com/g/d3-js/c/T9l5SN0-66c?pli=1
