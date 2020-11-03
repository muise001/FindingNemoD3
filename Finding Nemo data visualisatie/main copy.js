const filteredData = {}

const MARGIN = {
	LEFT: 100,
	RIGHT: 10,
	TOP: 10,
	BOTTOM: 130
}

const WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM

// Creating main SVG
const svg = d3.select("#chart-area") // Where is the svg going? (select target div)
  .append("svg") // Add svg
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT) // give attributes to svg
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

// Create group template
const g = svg.append("g") // add "<g>" in <svg>
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`) // center out the group

const x = d3
  .scaleLinear()
  .range([0, WIDTH]) // provide range of x

let y = d3.scaleBand()

const xLabel = g.append("text")
const yLabel = g.append("text")

const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0,${HEIGHT})`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")

xLabel
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Scenes")

yLabel
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -40)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Characters")

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
        })
    }       

getData()

const update = data => {

    y.domain(Object.keys(data)).range([0, HEIGHT])
    x.domain([0, 500])

    const xAxisCall = d3.axisBottom(x)

    xAxisGroup
    	.call(xAxisCall)
		.selectAll("text")
			.style("fill", "1ac9e6")
      		.attr("y", "10")
      		.attr("x", "-5")
      		.attr("text-anchor", "end")
              .attr("transform", "rotate(-40)")
              
    const yAxisCall = d3.axisLeft(y)

    yAxisGroup
        .call(yAxisCall)


    const circles = g.selectAll("circle").data(Object.entries(data, d => d[0]));

    // EXIT old elements not present in new data
    // circles.exit()
    // .remove()
    // .attr("opacity", 0)

    //ENTER new elements present in new data
    circles.enter().append("circle")
        .attr("cx", d => {
            console.log(d[1].scentance.)
        })
        .attr("cy", "5")
        .attr("r", "100")
}