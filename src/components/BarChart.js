import d3 from "d3";
import BaseChart from "./BaseChart";

export default class BarChart extends BaseChart {
    getScaleX() {
        return d3.scale.ordinal().rangeRoundBands([0, this.props.width], 0.1);
    }

    getScaleY() {
        return d3.scale.linear().range([this.props.height, 0]);
    }

    createAxisX(x) {
        return d3.svg.axis().scale(x).orient("bottom");
    }

    createAxisY(y) {
        return d3.svg.axis().scale(y).orient("left");
    }

    onMouseOver(d) {
        return this.tooltip
            .style("visibility", "visible")
            .text(`${d.xValue} (${d.yValue})`);
    }

    create(data) {
        this.x = this.getScaleX();
        this.y = this.getScaleY();

        const xAxis = this.createAxisX(this.x);
        const yAxis = this.createAxisY(this.y);

        const width = this.props.width + this.props.margin.left + this.props.margin.right;
        const height = this.props.height + this.props.margin.top + this.props.margin.bottom;

        this.svg = d3.select(this.el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", `translate(${this.props.margin.left}, ${this.props.margin.top})`);

        this.x.domain(data.map(d => { return d.xValue; }));
        this.y.domain([0, d3.max(data, d => { return d.yValue; })]);

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${this.props.height})`)
            .call(xAxis);

        this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        this.svg.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => { return this.x(d.xValue); })
            .attr("width", this.x.rangeBand())
            .attr("y", d => { return this.y(d.yValue); })
            .attr("height", d => { return this.props.height - this.y(d.yValue); })
            .on("mouseover", this.onMouseOver.bind(this))
            .on("mousemove", this.onMouseMove.bind(this))
            .on("mouseout", this.onMouseOut.bind(this))
            .style("fill", "steelblue");

        this.svg.selectAll("path")
            .style("fill", "none")
            .style("stroke", "#000")
            .style("shape-rendering", "crispEdges");

        if (this.showTooltips) {
            this.addTooltips();
        }
    }

    update(data) {
        // Recalculate domain given new data
        this.y.domain([0, d3.max(data, d => { return d.yValue; })]);
        this.x.domain(data.map(d => { return d.xValue; }));

        // We now have an updated Y axis
        const updatedAxisY = this.createAxisY(this.y);
        const updatedAxisX = this.createAxisX(this.x);

        // Let's update the x & y axis
        this.svg.selectAll("g.y.axis").call(updatedAxisY);
        this.svg.selectAll("g.x.axis").call(updatedAxisX);

        this.svg.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .on("mouseover", this.onMouseOver.bind(this))
            .on("mousemove", this.onMouseMove.bind(this))
            .on("mouseout", this.onMouseOut.bind(this))
            .style("fill", "steelblue");

        this.svg.selectAll("rect")
            .data(data)
            .transition().duration(this.transitionDuration)
                .attr("class", "bar")
                .attr("y", d => { return this.y(d.yValue); })
                .attr("height", d => { return this.props.height - this.y(d.yValue); })
                .attr("x", d => { return this.x(d.xValue); })
                .attr("width", this.x.rangeBand());
    }
}
