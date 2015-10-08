import React from "react";
import { findDOMNode } from "react-dom";

import BubbleChart from "./BubbleChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

export default class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.chartToClassMappings = {
            bubble: BubbleChart,
            bar: BarChart,
            pie: PieChart
        };
    }

    componentDidMount() {
        if (Object.keys(this.props.data).length === 0) {
            return;
        }

        const el = findDOMNode(this);

        this.chart = new this.chartToClassMappings[this.props.type](el, this.props);
        this.chart.create(this.props.data);
    }

    componentDidUpdate() {
        this.chart.update(this.props.data);
    }

    componentWillUnmount() {
        this.chart.unmount();
    }

    render() {
        return (<div className="chart"></div>);
    }
}
