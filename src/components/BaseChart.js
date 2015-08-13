import d3 from "d3";
import React from "react";

export default class BaseChart {
    constructor(el, props) {
        this.el = el;
        this.props = props;
        this.color = this.getColor();
        this.showTooltips = this.props.showTooltips ? true : false;
        this.transitionDuration = this.props.transitionDuration || 1000;
    }

    // Overwrite this function to apply your own color scheme
    getColor() {
        return d3.scale.category20c();
    }

    // We don't show tooltips by default
    addTooltips() {
        this.tooltip = d3.select(this.el)
            .append("div")
            .classed("tooltip", true)
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("border", "1px solid grey")
            .style("border-radius", "3px")
            .style("text-align", "center")
            .style("padding", "8px 0")
            .style("width", "100px")
            .style("background-color", "#000")
            .style("color", "#FFF");
    }

    onMouseMove() {
        if (!this.showTooltips) {
            return;
        }

        const top = (event.pageY - 10);
        const left = (event.pageX + 10);

        return this.tooltip
            .style("top",  `${top}px`)
            .style("left", `${left}px`);
    }

    onMouseOut() {
        if (!this.showTooltips) {
            return;
        }

        return this.tooltip.style("visibility", "hidden");
    }

    // Overwrite this function to apply your own removal logic
    unmount() {
        this.el.remove();
    }

    create(data) {
        // To be implemented by class extending BaseChart
    }

    update(data) {
        // To be implemented by class extending BaseChart
    }
}