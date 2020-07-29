import * as d3 from "d3";

const MARGIN = { TOP: 10, BOTTOM: 50, LEFT: 70, RIGHT: 10 }; // D3 margin convention
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

export default class D3Chart2 {
  constructor(element) {
    const vis = this;

    vis.svg = d3
      .select(element)
      .append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append("g") // group
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`); // to shift the group to the center of canvas

    vis.xLabel = vis.svg
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 50)
      .attr("text-anchor", "middle")
      .text("The world's tallest men");

    vis.svg
      .append("text")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .text("Height in cm")
      .attr("transform", "rotate(-90)");

    vis.xAxisGroup = vis.svg
      .append("g")
      .attr("transform", `translate(0, ${HEIGHT})`); // to move x axis to the bottom

    vis.yAxisGroup = vis.svg.append("g");

    Promise.all([
      d3.json("https://udemy-react-d3.firebaseio.com/tallest_men.json"),
      d3.json("https://udemy-react-d3.firebaseio.com/tallest_women.json"),
    ]).then((datasets) => {
      vis.menData = datasets[0];
      vis.womenData = datasets[1];
      vis.update("men");
    });
  }

  update(gender) {
    const vis = this;

    vis.data = (gender == "men") ? vis.menData : vis.womenData;
    vis.xLabel.text(`The world's tallest ${gender}`);


    // const max = d3.max(vis.data, (d) => d.height); // runs through array and returns largest value
    // const min = d3.min(vis.data, (d) => d.height); // runs through array and returns lowest value

    const y = d3
      .scaleLinear() // for scaling data on Y axis
      .domain([
        d3.min(vis.data, (d) => d.height * 0.95),
        d3.max(vis.data, (d) => d.height),
      ]) // data input values
      .range([HEIGHT, 0]); // number of pixels on the screen (as max we've entered the canvas height)

    const x = d3
      .scaleBand() // for scaling data on X asis
      .domain(vis.data.map((d) => d.name)) // it will return the array of names
      .range([0, WIDTH])
      .padding(0.4);

    const xAxisCall = d3.axisBottom(x);
    vis.xAxisGroup.transition().duration(500).call(xAxisCall); // sets up x axis

    const yAxisCall = d3.axisLeft(y);
    vis.yAxisGroup.transition().duration(500).call(yAxisCall); // sets up y axis

    // D3 general update pattern: (1) data join; (2) exit; (3) update; (4) enter

    // DATA JOIN
    const rects = vis.svg.selectAll("rect").data(vis.data);

    // EXIT
    rects.exit()
      .transition().duration(500)
      .attr("height", 0)
      .attr("y", HEIGHT)
      .remove();

    // UPDATE
    rects.transition().duration(500)
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.height))
      .attr("width", x.bandwidth)
      .attr("height", (d) => HEIGHT - y(d.height));

    // ENTER
    rects
      .enter()
      .append("rect")
        .attr("x", (d) => x(d.name))
        .attr("width", x.bandwidth) // this will scale baars on x axis
        .attr("fill", "grey")
        .attr("y", HEIGHT)
      .transition().duration(500)
        .attr("height", (d) => HEIGHT - y(d.height)) // this will scale bars on y axis
        .attr("y", (d) => y(d.height))
  }
}
