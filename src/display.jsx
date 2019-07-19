import React, { Component } from "react"
import * as d3 from "d3"

class Display extends Component {

    componentWillReceiveProps(props) {
        const display = props.display
        const displaySVG = d3.select("#display")
        const width = displaySVG.node().parentNode.clientWidth
        displaySVG
            .attr("height",30)
            .attr("width",width)
        const endDate = new Date(new Date().setHours(display.getHours() + 1))
        displaySVG
            .append("rect")
            .attr("height",30)
            .attr("width",width)
            .attr("fill","#FFF")
            .attr("transform","translate(0,0)")
        displaySVG
            .append("text")
            .text(display.toLocaleString() +"至"+endDate.toLocaleString())
            .attr("transform","translate(0,20)")

        // const lines = distributionSVG
        //     .append("g")
        //     .attr("class","lines")
        //     .selectAll("line")
        //     .data(lineData)
        //     .enter()
        //     .append("line")
        //     .attr("x1",d => d[0][0])
        //     .attr("x2",d => d[1][0])
        //     .attr("y1",hScale(180) + 20)
        //     .attr("y2",hScale(180) + 20)
        //     .transition()
        //     .duration(500)
        //     .attr("y1",d => d[0][1])
        //     .attr("y2",d => d[1][1])
        //     .attr("stroke-width",2)
        //     .attr("stroke", "#d9dde2")

        // const points = distributionSVG
        //     .append("g")
        //     .attr("class","points")
        //     .selectAll("circle")
        //     .data(distribution)
        //     .enter()
        //     .append("circle")
        //     .attr("r",3)
        //     .attr("cx",function(d,i) {
        //         return padding + (i + 0.5) * rectWidth
        //     })
        //     .attr("fill","black")
        //     .attr("cy",hScale(180) + 20)
        //     .transition()
        //     .duration(500)
        //     .attr("cy",function(d) {
        //         return hScale(180 - d) + 20
        //     })
            
        
        // distributionSVG
        //     .append("g")
        //     .attr("transform","translate(" + padding + ",20)")
        //     .call(hAxis)
        
        // distributionSVG
        //     .append("g")
        //     .attr("transform","translate(16," + (height - padding - 10) + ")")
        //     .call(xAxis)

    }
    render() {
        return <svg id="display" />
    }
}

export default Display