import * as d3 from "d3";

const url = "https://udemy-react-d3.firebaseio.com/tallest_men.json";
const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }; // D3 margin convention
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart2 {
  constructor(element) {
    const svg = d3.select(element)
      .append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append("g") // group
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`); // to shift the group to the center of canvas
    
     d3.json(url).then(data => {
        const max = d3.max(data, d => d.height) // runs through array and returns largest value
        const min = d3.min(data, d => d.height)  // runs through array and returns lowest value

        const y = d3.scaleLinear() // for scaling data on Y axis
            .domain([min * 0.95, max]) // data input values 
            .range([HEIGHT, 0]) // number of pixels on the screen (as max we've entered the canvas height)
        
        const x = d3.scaleBand() // for scaling data on X asis
            .domain(data.map(d => d.name)) // it will return the array of names
            .range([0, WIDTH])
            .padding(0.4);

        const xAxisCall = d3.axisBottom(x);
        svg.append("g")
            .attr("transform", `translate(0, ${HEIGHT})`) // to move x axis to the bottom
            .call(xAxisCall); // sets up x axis

        const yAxisCall = d3.axisLeft(y);
        svg.append("g").call(yAxisCall); // sets up y axis

        svg.append("text")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 50)
            .attr("text-anchor", "middle")
            .text("The world's tallest men");
        
        svg.append("text")
            .attr("x", - (HEIGHT / 2))
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .text("Height in cm")
            .attr("transform", "rotate(-90)");

        const rects = svg.selectAll("rect")
            .data(data);

        rects.enter().append("rect")
            .attr("x", d => x(d.name))
            .attr("y", d => y(d.height)) 
            .attr("width", x.bandwidth) // this will scale bears on x axis
            .attr("height", d => HEIGHT - y(d.height)) // this will scale bars on y axis
            .attr("fill", "grey");
        

    })
  }

  update () {
      //
  }
}
