import React, { Component } from "react";
import D3Chart2 from "./D3Chart2";

export default class ChartWrapper2 extends Component {
  componentDidMount() {
    this.setState({
      chart: new D3Chart2(this.refs.chart),
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
      this.state.chart.update(nextProps.gender)
  }

  render() {
    return <div ref="chart"></div>;
  }
}
