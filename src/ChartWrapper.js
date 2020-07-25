import React, {useRef, useState, useEffect} from "react";
import D3Chart from "./D3Chart";
import D3Chart2 from "./D3Chart2";

const ChartWrapper = () => {
    const chartArea = useRef(null);
    const [chart, setChart] = useState(null);

    useEffect(() => {
        if (!chart) {
            setChart(new D3Chart2(chartArea.current))
        }
        else if (chart.data) {
            chart.update()
        }
    }, [chart])

    return (
        <div className="chart-area" ref={chartArea}></div>
    )
}

export default ChartWrapper;