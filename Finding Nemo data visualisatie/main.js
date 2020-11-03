const filteredData = {}

const MARGIN = {
	LEFT: 150,
	RIGHT: 10,
	TOP: 10,
	BOTTOM: 130
}

let selectedScenes = []

const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM

const colorGradient = ["255,235,204", "187,220,205", "153, 203, 205", "120, 188, 207", "97,168,202", "83,143,186", "69,118,169", "56,94,153", "43,68,138", "30,45,122", "23,33,97", "17,24,72"]

// Creating main SVG
const svg = d3.select("#chart-area") // Where is the svg going? (select target div)
  .append("svg") // Add svg
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT) // give attributes to svg
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

// Create group template
const g = svg.append("g") // add "<g>" in <svg>
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`) // center out the group

const x = d3
  .scaleLinear().range([0, WIDTH])

const y = d3.scaleBand().range([0, HEIGHT])

const xLabel = g.append("text")
const yLabel = g.append("text")

const gradientScale = d3.scaleLog()

const graphScreen = g.append("g").attr("id", "screen")

const selectionBackground = g.append("g").attr("id", "selectionBackground")

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("padding", "10px")
    .style("background-color", "rgba(0,255,0,0.7)")
    .style("position", "absolute")
    .style("transform", "translate(5px, -50%)")

const hoverLine = graphScreen.append("g") 
    // .style("display", "none")

const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0,${HEIGHT})`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0,0)")

xLabel
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Scenes (click on scene to see scene)")

yLabel
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -120)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Characters")

const t = d3.transition().duration(1500) 

const getData = () => {
    fetch("findingNemo.txt")
        .then(res => res.text())
        .then(data => {
            const dataSplittedByLines = data.match(/[^\r\n]+/g)

            let scene = 0 
            let currentLine = 0
            let latestCharacter = ""
            dataSplittedByLines.forEach((line, i) => {
                if (line.includes("__Scene__")) {
                    scene = Number(line.split("__Scene__")[1])
                } else if (line[0].match(/[A-Z ]+/) && line[1].match(/[A-Z ]+/)){
                    latestCharacter = line
                } else {
                    latestCharacter.split(",").forEach(character => {
                        if (!filteredData[character]) {
                            filteredData[character] = {
                                scentance : [],
                            }
                        }
                        const previousLine = dataSplittedByLines[i - 1]
                        if(previousLine[0].match(/[A-Z ]+/) && previousLine[1].match(/[A-Z ]+/)){
                            currentLine++
                            filteredData[character].scentance.push({
                                line,
                                scene,
                                lineNumber: currentLine
                            })
                        } else {
                            filteredData[character]
                                .scentance[filteredData[character].scentance.length -1]
                                .line = filteredData[character].scentance[filteredData[character].scentance.length -1].line + " " + line
                        }
                    })
                }
            })
            update(filteredData)
            
            svg.selectAll(".x.axis .tick text")
                .on("click", (d) => sceneFilter(filteredData, d))
        
            // svg.selectAll(".x.axis .tick").on("mouseover", d => {
            // })    
        })
    }       

getData()

const update = data => {
    gradientScale.domain([1, 372]).range([0, colorGradient.length -1])

    const allLinesWithNamesData = []
    const sceneCoordinates = {
        lineNumber: [], 
        scene: []
    }

    console.log(Object.keys(data).length -1)
    
    Object.entries(data).forEach(characterObj => {
        characterObj[1].scentance.map(scentance => {
            allLinesWithNamesData.push({...scentance, name: characterObj[0], totalLinesByCharacter: characterObj[1].scentance.length})
        })
    })

    let currentScene = allLinesWithNamesData[0].scene

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

    y.domain(Object.keys(data))
    x.domain([allLinesWithNamesData[0].lineNumber, allLinesWithNamesData[allLinesWithNamesData.length - 1].lineNumber])

    const xAxisCall = d3.axisBottom(x).tickValues(sceneCoordinates.lineNumber).tickFormat((d, i) => sceneCoordinates.scene[i])

    xAxisGroup
        .transition(t)
        .call(xAxisCall.tickSize(-HEIGHT))
		.selectAll("text")
			.style("fill", "white")
      		.attr("y", "10")
      		.attr("x", "-5")
      		.attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")

    xAxisGroup.selectAll("line").attr("y1", 5) 
    
              
    const yAxisCall = d3.axisLeft(y)

        // `rgb(${colorGradient[Math.round(gradientScale(d.totalLinesByCharacter))]})`
   

    yAxisGroup
        // .transition(t) fixes bug, not nice, but check later again
        .call(yAxisCall.scale(y))
            .selectAll("text")
            .attr("fill", d => {
                return data[d] ? `rgb(${colorGradient[Math.round(gradientScale(data[d].scentance.length))]})` : ""})
            .style("font-weight", "bold")

    const tickSize = d3.select(".y.axis .tick")._groups[0][0].attributes.transform.value

    console.log(tickSize)
    console.log(allLinesWithNamesData)

    const circles = graphScreen.attr("transform", tickSize).selectAll("circle")
        .data(allLinesWithNamesData, d => d.lineNumber)

    // EXIT old elements not present in new data
    circles.exit()
        .remove()

    //ENTER new elements present in new data
    circles.enter().append("circle")
        .attr("cx", d => x(d.lineNumber))
        .attr("cy", HEIGHT)
        .attr("r", "3")
        .on("mouseover", d => {
            hoverLineSettings(d, "enter")
            tooltip
              .html(`
                    <p>${d.line}</p>
                    <ul>
                        <li>said by: ${d.name}</li>
                        <li>scene: ${d.scene}</li>
                    </ul>
                      
              `)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + 5 + "px")
              .style("opacity", 1)
          })
          .on("mouseout", () => {
            hoverLineSettings("remove")
            tooltip.style("opacity", 0)
          })
          .merge(circles)
            .transition(t)
                .attr("cx", d => x(d.lineNumber))
                .attr("cy", d => y(d.name))
                .attr("r", "3")
                .attr("fill", d => `rgb(${colorGradient[Math.round(gradientScale(d.totalLinesByCharacter))]})`)
}

const hoverLineSettings = (d, state) => {
    // TOOLTIP LINES
    if(state === "enter"){
        hoverLine.append("path")
        .attr("class", "tooltipLine")
        .attr("d", d3.line()([[0, y(d.name) + 5], [x(d.lineNumber), y(d.name) + 5]]))
        .style("stroke", "blue")
        .attr("fill", "none")

        hoverLine.append("path")
        .attr("class", "tooltipLine")
        .attr("d", d3.line()([[x(d.lineNumber), 0], [x(d.lineNumber), HEIGHT]]))
        .style("stroke", "blue")
        .attr("fill", "none")
        
    } else {
        hoverLine.selectAll("path").remove()
    }
}

const sceneFilter = (data, d) => {

    startSelection(data, d, d3.event)

    sceneClickedOn = Number(d3.event.target.innerHTML)
    d3.event.target.classList.add("active")
    if(selectedScenes.includes(sceneClickedOn)) {
        selectedScenes = []
    } else if (selectedScenes.length === 1 && !selectedScenes.includes(sceneClickedOn)) {

        d3.selectAll("#indicator").remove()

        selectedScenes.push(sceneClickedOn)
        selectedScenes.sort((a, b) => a - b)

        let filteredData = {}

        Object.entries(data).forEach(characterWithScentance => {
            filteredData = {
                ...filteredData,
                [characterWithScentance[0]] : {
                    scentance : []
                }
            }
            characterWithScentance[1].scentance.forEach(scentance => {
                if (scentance.scene >= selectedScenes[0] && scentance.scene < selectedScenes[1]){
                    filteredData[characterWithScentance[0]].scentance.push(scentance)
                }
            })
        })

        Object.keys(filteredData).forEach(key => filteredData[key].scentance.length === 0 ? delete filteredData[key] : {});

        selectedScenes = []
        update(filteredData)


    } else if(selectedScenes.length !== 2){
        selectedScenes.push(sceneClickedOn)
    } 
    
}

const startSelection = (data, d, e) => {
    const startPath = [[x(d), 0], [x(d), HEIGHT]]

    g.append("path")
        .attr("id", "indicator")
        .attr("d", d3.line()([startPath]))

    svg.selectAll(".x.axis .tick text").on("mouseover", val => {
        g.select("#indicator")
            .attr("d", d3.line()([...startPath, [x(val), HEIGHT], [x(val), 0]]))
            .attr("fill", "rgba(0,0,0,.2)")
            .style("z-index", "-1")
    })
} 