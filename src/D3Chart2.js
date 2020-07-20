import * as d3 from "d3";

const url = "https://udemy-react-d3.firebaseio.com/tallest_men.json";

export default class D3Chart2 {
  constructor(element) {
    const svg = d3.select(element)
      .append("svg")
        .attr("width", 800)
        .attr("height", 500);

    d3.json(url).then(data => {
        const y = d3.scaleLinear() // for scaling data on Y axis
            .domain([0, 272]) // data input values 
            .range([0, 500]) // number of pixels on the screen (as max we've entered the canvas height)
        
        const x = d3.scaleBand() // for scaling data on X asis
            .domain(data.map(d => d.name)) // it will return the array of names
            .range([0, 800])
            .padding(0.4)

        const rects = svg.selectAll("rect")
            .data(data);

        rects.enter().append("rect")
            .attr("x", d => x(d.name))
            .attr("y", 0)
            .attr("width", x.bandwidth)
            .attr("height", d => y(d.height)) // this will scale up the bars on Y axis)
            .attr("fill", "grey")

    })
  }

  update () {
      //
  }
}
