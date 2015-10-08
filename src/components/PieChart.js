import d3 from "d3";
import BaseChart from "./BaseChart";

export default class PieChart extends BaseChart {

    // d3's default transition does not interpolate pie chart
    // segments correctly; all intermediate `d` values for
    // the `path`s are invalid, so will throw errors.
    // What we are doing here is specifying to d3 how to
    // correctly generate all those previously invalid
    // values.
    arcTween(a) {
        var interpolated = d3.interpolate(this._originalAngles, a);
        this._originalAngles = interpolated(0);

        return t => {
            return this.arc(interpolated(t));
        };
    }

    onMouseOver(d) {
        return this.tooltip
            .style("visibility", "visible")
            .text(`${d.data.key} (${d.data.value})`);
    }

    create(data) {
        const width = this.props.width;
        const height = this.props.height;
        const radius = Math.min(width, height) / 2;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        this.arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(this.props.innerRadius);

        this.pie = d3.layout.pie()
            .sort(null)
            .value(d => { return d.value; });

        this.svg = d3.select(this.el).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
                .attr("transform", `translate(${halfWidth}, ${halfHeight})`);

        this.path = this.svg.selectAll("path")
            .data(this.pie(d3.entries(data)))
            .enter().append("path");

        this.path
            .attr("fill", (d, i) => { return this.color(i); })
            .attr("d", this.arc)
            .each(d => {
                // Let's keep a reference to the
                // original angles to make use of
                // in our arcTween helper.
                this._originalAngles = d;
            })
            .on("mouseover", this.onMouseOver.bind(this))
            .on("mousemove", this.onMouseMove.bind(this))
            .on("mouseout", this.onMouseOut.bind(this));

        if (this.showTooltips) {
            this.addTooltips();
        }
    }

    update(data) {
        this.path
            .data(this.pie(d3.entries(data)))
            .transition().duration(this.transitionDuration)
            .attrTween("d", this.arcTween.bind(this));

        this.path
            .data(this.pie(d3.entries(data)))
            .enter().append("path")
            .attr("fill", (d, i) => { return this.color(i); })
            .attr("d", this.arc)
            .each(d => {
                // Let's keep a reference to the
                // original angles to make use of
                // in our arcTween helper.
                this._originalAngles = d;
            })
            .on("mouseover", this.onMouseOver.bind(this))
            .on("mousemove", this.onMouseMove.bind(this))
            .on("mouseout", this.onMouseOut.bind(this));
    }
}
