import * as d3 from "d3";
import BaseChart from "./BaseChart";

export default class BubbleChart extends BaseChart {
    addText() {
        this.text = this.node.append("text")
            .attr("dy", ".3em")
            .attr("class", "bubble-text")
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .text(this.setText);
    }

    setText(node) {
        if (node.data.value > 15) { return node.data.name; }
    }

    onMouseOver(node) {
        return this.tooltip
            .style("visibility", "visible")
            .text(`${node.data.name} (${node.data.value})`);
    }

    create(data) {
        this.bubble = d3.pack()
            .size([this.props.diameter, this.props.diameter])
            .padding(1.5);

        this.root = d3.hierarchy(data).sum(nodeData => nodeData.value);

        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.props.diameter)
            .attr("height", this.props.diameter)
            .attr("class", "bubble");

        this.node = this.svg.selectAll(".node")
            .data(this.bubble(this.root).children)
            .enter().append("g")
                .attr("class", "node")
                .attr("transform", d => { return `translate(${d.x}, ${d.y})`; });

        this.node.append("circle")
            .attr("r", node => { return node.r; })
            .style("fill", node => { return this.color(node.data.name); })
            .on("mouseover", this.onMouseOver.bind(this))
            .on("mousemove", this.onMouseMove.bind(this))
            .on("mouseout", this.onMouseOut.bind(this));

        d3.select(document.frameElement).style("height", `${this.props.diameter} px`);

        this.addText();

        if (this.showTooltips) {
            this.addTooltips();
        }
    }

    update(data) {
        const formattedData = this.bubble(this.root).children;

        this.node = this.svg.selectAll(".node")
            .data(formattedData);

        const nodeEnter = this.node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => { return `translate(${d.x}, ${d.y})`; });

        nodeEnter
            .append("circle")
            .attr("r", d => { return d.r; })
            .style("fill", (d, i) => { return this.color(i); })
            .on("mouseover", this.onMouseOver.bind(this))
            .on("mousemove", this.onMouseMove.bind(this))
            .on("mouseout", this.onMouseOut.bind(this));

        this.text
            .data(formattedData)
            .text(this.setText);

        this.node.select("circle")
            .transition().duration(this.transitionDuration)
            .attr("r", d => {
                return d.r;
            })
            .style("fill", (d, i) => {
                return this.color(i);
            });

        this.node.transition().attr("class", "node")
            .attr("transform", d => {
                return `translate(${d.x}, ${d.y})`;
            });

        this.node.exit().remove();
    }
}
