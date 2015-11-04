import d3 from "d3";
import React from "react";
import { render } from "react-dom";

import Chart from "../lib/components/Chart";

class ExampleBarChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [
                { xValue: "React", yValue: 2 },
                { xValue: "Relay", yValue: 12 },
                { xValue: "GraphQL", yValue: 5 },
                { xValue: "Radium", yValue: 7 },
                { xValue: "Babel", yValue: 5 },
            ]
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                data: [
                    { xValue: "React", yValue: 2 },
                    { xValue: "Relay", yValue: 8 },
                    { xValue: "GraphQL", yValue: 15 },
                    { xValue: "Radium", yValue: 27 },
                    { xValue: "Babel", yValue: 5 },
                ]      
            })
        }, 3000);
    }

    render() {
        return (
            <div>
                <h2>Bar Chart</h2>
                <Chart
                    type={"bar"}
                    width={500}
                    height={500}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    showTooltips={true}
                    data={this.state.data}
                />
            </div>
        );
    }
}

class ExamplePieChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                "React": 2,
                "Relay": 12,
                "GraphQL": 5,
                "Radium": 7,
                "Babel": 5,
            }
        };
    }

    render() {
        return (
            <div>
                <h2>Pie Chart</h2>
                <Chart
                    type={"pie"}
                    width={300}
                    height={300}
                    showTooltips={true}
                    data={this.state.data}
                />
            </div>
        );
    }

}

class ExampleDonutChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                "React": 2,
                "Relay": 12,
                "GraphQL": 5,
                "Radium": 7,
                "Babel": 5,
            }
        };
    }

    render() {
        return (
            <div>
                <h2>Donut Chart</h2>
                <Chart
                    type={"pie"}
                    width={300}
                    height={300}
                    innerRadius={100}
                    showTooltips={true}
                    showLegend={true}
                    data={this.state.data}
                />
            </div>
        );
    }

}

class ExampleBubbleChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                children: [
                    { name: "Alaa", value: 1 },
                    { name: "Zaid", value: 1 },
                    { name: "Kareem", value: 2 },
                    { name: "Mahmoud", value: 1 },
                    { name: "Tariq", value: 1 },
                    { name: "Shareef", value: 1 },
                    { name: "Tom", value: 41 },
                    { name: "Forest", value: 2 },
                    { name: "John", value: 84 },
                    { name: "Alex", value: 11 },
                    { name: "Donald", value: 7 },
                    { name: "Mark", value: 29 },
                    { name: "Charles", value: 20 },
                    { name: "Quincy", value: 5 },
                    { name: "Alvan", value: 1 },
                    { name: "Don", value: 32 },
                    { name: "Hassan", value: 2 },
                    { name: "Jordan", value: 8 },
                    { name: "Michael", value: 32 },
                    { name: "Steven", value: 5 },
                    { name: "Rafael", value: 2 },
                    { name: "Rick", value: 12 },
                ]
            }
        }
    }

    render () {
        return (
            <div>
                <h2>Bubble Chart</h2>
                <Chart
                    type={"bubble"}
                    diameter={500}
                    showTooltips={true}
                    data={this.state.data}
                />
            </div>
        );
    }
}

class SomeCustomChart {
    constructor(el, props) {
        this.el = el;
        this.props = props;
    }

    getColor() {
        return d3.scale.category20c();
    }

    create(data) {
        const width = 400;
        const height = 400;

        const color = this.getColor();

        const radius = Math.min(width, height) / 2;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const arc = d3.svg.arc()
            .outerRadius(radius - 10);

        const pie = d3.layout.pie()
            .sort(null)
            .value(d => { return d.value; });

        const svg = d3.select(this.el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", `translate(${halfWidth}, ${halfHeight})`);

        const path = svg.selectAll("path")
            .data(pie(d3.entries(data)))
            .enter().append("path");

        path
            .attr("fill", (_d, i) => { return color(i); })
            .attr("d", arc);
    }

    update() {
        // We don't want to do anything with
        // updates in this instance.
    }

    unmount() {
        this.el.remove();
    }
}

class ExampleCustomChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                "React": 2,
                "Relay": 12,
                "GraphQL": 5,
                "Radium": 7,
                "Babel": 5,
            }
        };
    }

    render() {
        return (
            <div>
                <h2>Custom Chart</h2>
                <Chart
                    type={"custom"}
                    customChart={SomeCustomChart}
                    data={this.state.data}
                />
            </div>
        );
    }

}

class App extends React.Component {
    render() {
        return (
            <div>
                <ExampleBarChart />
                <ExamplePieChart />
                <ExampleDonutChart />
                <ExampleBubbleChart />
                <ExampleCustomChart />
            </div>
        );
    }
}

render(<App />, document.getElementById("app"));
